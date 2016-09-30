package main

import (
	"bytes"
	"io"
	"net/http/httptest"
	"net/url"
	"strings"
	"sync"
	"testing"
	"unicode/utf8"

	"golang.org/x/net/websocket"
)

type testnagome struct {
	buf chan (*bytes.Buffer)
}

func (tn *testnagome) Close() error {
	return nil
}
func (tn *testnagome) Read(p []byte) (n int, err error) {
	return (<-tn.buf).Read(p)
}
func (tn *testnagome) Write(p []byte) (n int, err error) {
	return len(p), nil
}

func TestMultiConnection(t *testing.T) {
	const testString = "test\n"

	tn := &testnagome{
		buf: make(chan (*bytes.Buffer)),
	}

	ngmr = io.ReadCloser(tn)
	ngmw = io.WriteCloser(tn)

	go func() {
		err := utf8SafeWrite(ngmr)
		if err != nil {
			t.Fatal(err)
		}
	}()

	ts := httptest.NewServer(websocket.Handler(BridgeServer))
	defer ts.Close()

	u, err := url.Parse(ts.URL)
	if err != nil {
		t.Fatal(err)
	}
	u.Scheme = "ws"

	var wg sync.WaitGroup
	var writewg sync.WaitGroup

	for i := 0; i < 3; i++ {
		wg.Add(1)
		writewg.Add(1)
		go func() {
			defer wg.Done()
			ws, err := websocket.Dial(u.String(), "", ts.URL)
			if err != nil {
				t.Fatal(err)
			}
			defer ws.Close()

			var msg = make([]byte, 512)
			var n int
			writewg.Done()
			if n, err = ws.Read(msg); err != nil {
				t.Fatal(err)
			}
			if string(msg[:n]) != testString {
				t.Errorf("got %v\nwant %v", msg[:n], []byte(testString))
			}
		}()
	}

	// Wait for connection of all clients
	writewg.Wait()

	tn.buf <- bytes.NewBufferString(testString)
	// Test for after being disconnected
	tn.buf <- bytes.NewBufferString(testString)

	wg.Wait()
}

func TestValidRune(t *testing.T) {
	const testStringPart = "すごく無駄に長い長文でしかもマルチバイトな感じなので適当に途中で切ると正しいテキストフレームにならない"
	testString := strings.Repeat(testStringPart, 50)

	tn := &testnagome{
		buf: make(chan (*bytes.Buffer)),
	}

	ngmr = io.ReadCloser(tn)
	ngmw = io.WriteCloser(tn)

	go func() {
		err := utf8SafeWrite(ngmr)
		if err != nil {
			t.Fatal(err)
		}
	}()

	ts := httptest.NewServer(websocket.Handler(BridgeServer))
	defer ts.Close()

	u, err := url.Parse(ts.URL)
	if err != nil {
		t.Fatal(err)
	}
	u.Scheme = "ws"

	var wg sync.WaitGroup
	var writewg sync.WaitGroup

	wg.Add(1)
	writewg.Add(1)
	go func() {
		defer wg.Done()
		ws, err := websocket.Dial(u.String(), "", ts.URL)
		if err != nil {
			t.Fatal(err)
		}
		defer ws.Close()

		var msg = make([]byte, 32*1024)
		var n int
		writewg.Done()
		if n, err = ws.Read(msg); err != nil {
			t.Fatal(err)
		}
		rcvd := msg[:n]

		if string(rcvd) == testString {
			t.Errorf("Message was not separated.\nLonger message is required for testing.")
		}
		if !utf8.Valid(rcvd) {
			t.Error("received message is not valid Unicode")
		}
	}()

	// Wait for connection of all clients
	writewg.Wait()

	tn.buf <- bytes.NewBufferString(testString)

	wg.Wait()
}
