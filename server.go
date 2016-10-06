package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"runtime"
	"sync"
	"time"
	"unicode/utf8"

	"golang.org/x/net/websocket"
)

const (
	defaultPort = "8753"
)

var (
	ngmr      io.ReadCloser
	ngmw      io.WriteCloser
	wscs      []*websocket.Conn
	mu        sync.Mutex
	connected = make(chan struct{})
	clientswg sync.WaitGroup
	appMode   bool
)

// Config is struct for server_config.json
type Config struct {
	Port       string   `json:"port"`
	RootURI    string   `json:"root_uri"`
	RootDir    string   `json:"root_dir"`
	NagomeExec []string `json:"nagome_exec"`
	AppMode    bool     `json:"app_mode"`
}

func utf8SafeWrite(src io.Reader) error {
	var utf8tmp []byte
	buf := make([]byte, 32*1024)

read:
	for {
		// append utf8tmp to the top of buf
		copy(buf, utf8tmp)
		// read into the rest buf
		nr, er := src.Read(buf[len(utf8tmp):])
		nr += len(utf8tmp)
		utf8tmp = utf8tmp[0:0]
		if nr > 0 {
			rb := buf[0:nr]
			if !utf8.Valid(rb) {
				for i := 1; ; i++ {
					if i > 4 {
						panic("invalid data (not utf-8)")
					}
					if i == nr {
						utf8tmp = make([]byte, i)
						copy(utf8tmp, buf[nr-i:nr])
						break read
					}
					rb = buf[0 : nr-i]
					if utf8.Valid(rb) {
						utf8tmp = append(utf8tmp, buf[nr-i:nr]...)
						nr -= i
						break
					}
				}
			}

			mu.Lock()
			for _, c := range wscs {
				if c == nil {
					continue
				}
				nw, ew := c.Write(rb)
				if ew != nil {
					fmt.Println(ew)
					continue
				}
				if nr != nw {
					err := io.ErrShortWrite
					fmt.Println(err)
					continue
				}
			}
			mu.Unlock()
		}
		if er == io.EOF {
			return nil
		}
		if er != nil {
			return er
		}
	}

	return nil
}

// BridgeServer receive a connection
func BridgeServer(wsc *websocket.Conn) {
	if appMode {
		clientswg.Add(1)
		defer clientswg.Done()
		select {
		case connected <- struct{}{}:
		default:
		}
	}

	memStats := &runtime.MemStats{}
	runtime.ReadMemStats(memStats)
	fmt.Println("goroutines", (runtime.NumGoroutine()))
	fmt.Println("memory.allocated", (memStats.Alloc))
	fmt.Println("memory.mallocs", (memStats.Mallocs))
	fmt.Println("memory.frees", (memStats.Frees))
	fmt.Println("memory.heap", (memStats.HeapAlloc))
	fmt.Println("memory.stack", (memStats.StackInuse))
	fmt.Println("writer array", wscs)
	fmt.Println()

	var no int

	mu.Lock()
	bl := false
	for i, v := range wscs {
		if v == nil {
			no = i
			wscs[i] = wsc
			bl = true
			break
		}
	}
	if !bl {
		no = len(wscs)
		wscs = append(wscs, wsc)
	}
	mu.Unlock()
	defer func() {
		mu.Lock()
		wscs[no] = nil
		mu.Unlock()
	}()

	_, err := io.Copy(ngmw, wsc)
	if err != nil {
		fmt.Println(err)
		return
	}
}

// This example demonstrates a trivial echo server.
func main() {
	var err error

	file, err := os.Open("./server_config.json")
	if err != nil {
		fmt.Println(err)
		return
	}
	d := json.NewDecoder(file)
	var c Config
	if err = d.Decode(&c); err != nil {
		fmt.Println(err)
		return
	}

	// connect to Nagome
	if len(c.NagomeExec) == 0 {
		fmt.Println("NagomeExec has not any command")
		return
	}
	cmd := exec.Command(c.NagomeExec[0], c.NagomeExec[1:]...)
	ngmw, err = cmd.StdinPipe()
	if err != nil {
		log.Println(err)
		return
	}
	defer ngmw.Close()
	ngmr, err = cmd.StdoutPipe()
	if err != nil {
		log.Println(err)
		return
	}
	defer ngmr.Close()
	err = cmd.Start()
	if err != nil {
		log.Println(err)
		return
	}

	fmt.Println(c.RootURI)

	go func() {
		err = utf8SafeWrite(ngmr)
		if err != nil {
			fmt.Println(err)
		}
	}()

	if c.AppMode {
		appMode = true
		go func() {
			// quit if not connected a while
			select {
			case <-time.After(time.Minute):
				fmt.Println("closing...\nNot connected a while")
				os.Exit(0)
			case <-connected:
			}
			// quit when all clients are disconnected
			for {
				clientswg.Wait()
				select {
				case <-time.After(2 * time.Second):
					fmt.Println("closing...\nAll clients are disconnected")
					os.Exit(0)
				case <-connected:
				}
			}
		}()
	}

	// serve
	http.Handle("/ws", websocket.Handler(BridgeServer))
	http.Handle("/app/", http.StripPrefix("/app/", http.FileServer(http.Dir(c.RootDir))))
	err = http.ListenAndServe(":"+c.Port, nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}
