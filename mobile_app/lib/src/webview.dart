import 'dart:async';

import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'dart:convert';
import 'dart:io' show Platform;

class WebViewStack extends StatefulWidget {
  const WebViewStack({super.key});

  @override
  State<WebViewStack> createState() => _WebViewStackState();
}

class _WebViewStackState extends State<WebViewStack> {
  var loadingPercentage = 0;
  var menuOpen = false;
  var svOpen = false;
  int svUser = 0;
  int svServer = 1;
  late WebViewController? _webViewController;

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        WebView(
          onWebViewCreated: (WebViewController webViewController) async {
            _webViewController = webViewController;
          },
          backgroundColor: Colors.black,
          initialUrl: 'https://a4-pearl.vercel.app',
          javascriptMode: JavascriptMode.unrestricted,
          javascriptChannels: {
            JavascriptChannel(
                name: 'Bridge',
                onMessageReceived: (JavascriptMessage message) {
                  //This is where you receive message from
                  //javascript code and handle in Flutter/Dart
                  //like here, the message is just being printed
                  //in Run/LogCat window of android studio
                  debugPrint(message.message);
                  final parsed = jsonDecode(message.message);
                  if (parsed['command'] == 'openAccMenu') {
                    menuOpen = true;
                    setState(() {});
                  } else if (parsed['command'] == 'votesdk') {
                    svServer = parsed['params']['serverID'];
                    svUser = parsed['params']['id'];
                    svOpen = true;
                    setState(() {});
                  }
                })
          },
          onPageStarted: (url) {
            setState(() {
              loadingPercentage = 0;
            });
          },
          onProgress: (progress) {
            setState(() {
              loadingPercentage = progress;
            });
          },
          onPageFinished: (url) {
            setState(() {
              loadingPercentage = 100;
            });
          },
        ),
        if (loadingPercentage < 100)
          Center(
            child: CircularProgressIndicator(
              value: loadingPercentage / 100.0,
            ),
          )
      ],
    );
  }
}
