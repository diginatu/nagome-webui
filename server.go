package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os/exec"
	"unicode/utf8"

	"golang.org/x/net/websocket"
)

const (
	defaultPort = "8753"
)

var (
	ngmr io.ReadCloser
	ngmw io.WriteCloser
)

func utf8SafeCopy(dst io.Writer, src io.Reader) (written int64, err error) {
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
			nw, ew := dst.Write(rb)
			if nw > 0 {
				written += int64(nw)
			}
			if ew != nil {
				err = ew
				break
			}
			if nr != nw {
				err = io.ErrShortWrite
				break
			}
		}
		if er == io.EOF {
			break
		}
		if er != nil {
			err = er
			break
		}
	}
	return written, err
}

// BridgeServer receive a connection
func BridgeServer(wsc *websocket.Conn) {
	fmt.Println("connected to a client")
	go func() {
		_, err := io.Copy(ngmw, wsc)
		if err != nil {
			fmt.Println(err)
			return
		}
	}()

	_, err := utf8SafeCopy(wsc, ngmr)
	if err != nil {
		fmt.Println(err)
		return
	}
}

// This example demonstrates a trivial echo server.
func main() {
	var err error

	// connect to Nagome
	cmd := exec.Command("nagome")
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

	fmt.Println("http://localhost:" + defaultPort + "/app")

	// serve
	http.Handle("/ws", websocket.Handler(BridgeServer))
	http.Handle("/app/", http.StripPrefix("/app/", http.FileServer(http.Dir("./build"))))
	err = http.ListenAndServe(":"+defaultPort, nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}
