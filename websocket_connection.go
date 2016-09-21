package main

import (
	"bufio"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"

	"golang.org/x/net/websocket"
)

// EchoServer the data received on the WebSocket.
func EchoServer(wsc *websocket.Conn) {
	// connect to Nagome via TCP
	addr := "localhost:" + os.Args[1]
	ngmc, err := net.Dial("tcp", addr)
	if err != nil {
		fmt.Println(err)
		return
	}

	go io.Copy(wsc, ngmc)
	io.Copy(ngmc, wsc)
}

// This example demonstrates a trivial echo server.
func main() {
	if len(os.Args) != 3 {
		fmt.Println("need 2 arguments")
		return
	}

	// connect to Nagome
	addr := "localhost:" + os.Args[1]
	ngmc, err := net.Dial("tcp", addr)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Fprintln(ngmc, `{
	"domain": "nagome_direct",
	"command": "No",
	"content": {
	"no": `+os.Args[2]+`}}`)

	// serve WebSocket
	go func() {
		http.Handle("/", websocket.Handler(EchoServer))
		err = http.ListenAndServe(":8753", nil)
		if err != nil {
			panic("ListenAndServe: " + err.Error())
		}
	}()

	// wait for disconnection from Nagome
	r := bufio.NewReader(ngmc)
	for {
		_, err = r.ReadByte()
		if err != nil {
			if err == io.EOF {
				return
			}
			return
		}
	}
}
