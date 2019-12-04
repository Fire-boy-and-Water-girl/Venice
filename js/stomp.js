//由CoffeeScript 1.7.1生成

/ *
   通过WebSocket踩踏http://www.jmesnil.net/stomp-websocket/doc/ | Apache许可证V2.0

   版权所有（C）2010-2013 [Jeff Mesnil]（http://jmesnil.net/）
   版权所有（C）2012 [FuseSource，Inc.]（http://fusesource.com）
 * /
 
（function（）{
    var Byte，Client，Frame，Stomp，
      __hasProp = {} .hasOwnProperty，
      __slice = [] .slice;
  
    字节= {
      LF：“ \ x0A”，
      NULL：“ \ x00”
    };
  
    框架=（function（）{
      var unmarshallSingle;
  
      功能Frame（命令，标题，正文）{
        this.command =命令;
        this.headers =标头！=空吗？标头：{};
        this.body = body！=空吗？身体 ： '';
      }
  
      Frame.prototype.toString = function（）{
        var行，名称，skipContentLength，值，_ref;
        行= [this.command];
        skipContentLength = this.headers ['content-length'] === false？真假;
        如果（skipContentLength）{
          删除this.headers ['content-length'];
        }
        _ref = this.headers;
        为（_ref中的名称）{
          如果（！__ hasProp.call（_ref，name））继续;
          值= _ref [名称];
          lines.push（“” +名称+“：” +值）；
        }
        如果（this.body &&！skipContentLength）{
          lines.push（“ content-length：” +（Frame.sizeOfUTF8（this.body）））;
        }
        lines.push（Byte.LF + this.body）;
        返回lines.join（Byte.LF）;
      };
  
      Frame.sizeOfUTF8 =函数{
        如果（s）{
          返回encodeURI（s）.match（/％.. | ./g）.length;
        }其他{
          返回0;
        }
      };
  
      unmarshallSingle =函数（数据）{
        var body，chr，command，divider，headerLines，headers，i，idx，len，line，start，trim，_i，_j，_len，_ref，_ref1;
        除法器= data.search（RegExp（“” + Byte.LF + Byte.LF））;
        headerLines = data.substring（0，除法器）.split（Byte.LF）;
        命令= headerLines.shift（）;
        标头= {};
        trim = function（str）{
          返回str.replace（/ ^ \ s + | \ s + $ / g，``）;
        };
        _ref = headerLines.reverse（）;
        对于（_i = 0，_len = _ref.length; _i <_len; _i ++）{
          行= _ref [_i];
          idx = line.indexOf（'：'）;
          headers [trim（line.substring（0，idx））] = trim（line.substring（idx + 1））;
        }
        正文='';
        开始=分频器+ 2;
        如果（headers ['content-length']）{
          len = parseInt（headers ['content-length']）;
          正文=（''+数据）.substring（start，start + len）;
        }其他{
          chr = null;
          for（i = _j =开始，_ref1 = data.length;开始<= _ref1？_j <_ref1：_j> _ref1; i =开始<= _ref1？++ _ j：--_ j）{
            chr = data.charAt（i）;
            如果（chr === Byte.NULL）{
              打破;
            }
            身体+ = chr;
          }
        }
        返回新的Frame（command，headers，body）;
      };
  
      Frame.unmarshall =函数（数据）{
        var数据；
        返回（function（）{
          var _i，_len，_ref，_results;
          _ref = datas.split（RegExp（“” + Byte.NULL + Byte.LF +“ *”））;
          _results = [];
          对于（_i = 0，_len = _ref.length; _i <_len; _i ++）{
            数据= _ref [_i];
            如果（（data！= null？data.length：void 0）> 0）{
              _results.push（unmarshallSingle（data））;
            }
          }
          返回_results;
        }）（）;
      };
  
      Frame.marshall = function（command，headers，body）{
        var frame;
        frame = new Frame（command，headers，body）;
        返回frame.toString（）+ Byte.NULL;
      };
  
      返回框架；
  
    }）（）;
  
    客户端=（function（）{
      var now;
  
      功能Client（ws）{
        this.ws = ws;
        this.ws.binaryType =“ arraybuffer”;
        this.counter = 0;
        this.connected = false;
        this.heartbeat = {
          传出：10000，
          传入：10000
        };
        this.maxWebSocketFrameSize = 16 * 1024;
        this.subscriptions = {};
      }
  
      Client.prototype.debug = function（message）{
        var _ref;
        返回typeof window！==“未定义” && window！== null？（_ref = window.console）！= null吗？''：无效0：无效0;
        // _ref.log（消息）
    };
  
      现在= function（）{
        如果（Date.now）{
          返回Date.now（）;
        }其他{
          返回新的Date（）。valueOf;
        }
      };
  
      Client.prototype._transmit = function（command，headers，body）{
        var out;
        out = Frame.marshall（命令，标题，正文）;
        如果（typeof this.debug ===“ function”）{
          this.debug（“ >>>” + out）;
        }
        而（true）{
          如果（out.length> this.maxWebSocketFrameSize）{
            this.ws.send（out.substring（0，this.maxWebSocketFrameSize））;
            out = out.substring（this.maxWebSocketFrameSize）;
            如果（typeof this.debug ===“ function”）{
              this.debug（“ remaining =” + out.length）;
            }
          }其他{
            返回this.ws.send（out）;
          }
        }
      };
  
      Client.prototype._setupHeartbeat = function（headers）{
        var serverIncoming，serverOutgoing，ttl，v，_ref，_ref1;
        if（（_ref = headers.version）！== Stomp.VERSIONS.V1_1 && _ref！== Stomp.VERSIONS.V1_2）{
          返回;
        }
        _ref1 =（function（）{
          var _i，_len，_ref1，_results;
          _ref1 = headers ['heart-beat']。split（“，”）;
          _results = [];
          对于（_i = 0，_len = _ref1.length; _i <_len; _i ++）{
            v = _ref1 [_i];
            _results.push（parseInt（v））;
          }
          返回_results;
        }）（），serverOutgoing = _ref1 [0]，serverIncoming = _ref1 [1];
        如果（！（this.heartbeat.outgoing === 0 || serverIncoming === 0））{
          ttl = Math.max（this.heartbeat.outgoing，serverIncoming）;
          如果（typeof this.debug ===“ function”）{
            this.debug（“每隔+ + ttl +” ms“发送PING）；
          }
          this.pinger = Stomp.setInterval（ttl，（function（_this）{
            return function（）{
              _this.ws.send（Byte.LF）;
              返回typeof _this.debug ===“ function”吗？_this.debug（“ >>> PING”）：无效0；
            };
          }）（这个））;
        }
        如果（！（this.heartbeat.incoming === 0 || serverOutgoing === 0））{
          ttl = Math.max（this.heartbeat.incoming，serverOutgoing）;
          如果（typeof this.debug ===“ function”）{
            this.debug（“每隔+ + ttl +” ms“检查PONG）；
          }
          返回this.ponger = Stomp.setInterval（ttl，（function（_this）{
            return function（）{
              var delta;
              delta = now（）-_this.serverActivity;
              如果（delta> ttl * 2）{
                如果（typeof _this.debug ===“ function”）{
                  _this.debug（“没有收到最后一个” +增量+“ ms”的服务器活动）；
                }
                返回_this.ws.close（）;
              }
            };
          }）（这个））;
        }
      };
  
      Client.prototype._parseConnect = function（）{
        var args，connectCallback，errorCallback，标头；
        args = 1 <= arguments.length？__slice.call（arguments，0）：[];
        标头= {};
        开关（args.length）{
          情况2：
            标头= args [0]，connectCallback = args [1];
            打破;
          情况3：
            if（args [1] instanceof Function）{
              标头= args [0]，connectCallback = args [1]，errorCallback = args [2];
            }其他{
              headers.login = args [0]，headers.passcode = args [1]，connectCallback = args [2];
            }
            打破;
          情况4：
            headers.login = args [0]，headers.passcode = args [1]，connectCallback = args [2]，errorCallback = args [3];
            打破;
          默认：
            headers.login = args [0]，headers.passcode = args [1]，connectCallback = args [2]，errorCallback = args [3]，headers.host = args [4];
        }
        返回[headers，connectCallback，errorCallback];
      };
  
      Client.prototype.connect = function（）{
        var args，errorCallback，标头，out;
        args = 1 <= arguments.length？__slice.call（arguments，0）：[];
        out = this._parseConnect.apply（this，args）;
        标头= out [0]，this.connectCallback = out [1]，errorCallback = out [2];
        如果（typeof this.debug ===“ function”）{
          this.debug（“ Opening Web Socket ...”）;
        }
        this.ws.onmessage =（function（_this）{
          返回函数（evt）{
            var arr，c，客户端，数据，帧，messageID，onreceive，subscription，_i，_len，_ref，_results；
            data = typeof ArrayBuffer！=='undefined'&& evt.data instanceof ArrayBuffer吗？（arr = new Uint8Array（evt.data），typeof _this.debug ===“ function”？_this.debug（“ ---得到的数据长度：” + arr.length）：void 0，（（（function {} {
              var _i，_len，_results;
              _results = [];
              对于（_i = 0，_len =长度长度; _i <_len; _i ++）{
                c = arr [_i];
                _results.push（String.fromCharCode（c））;
              }
              返回_results;
            }）（））。join（''））：evt.data;
            _this.serverActivity = now（）;
            如果（数据=== Byte.LF）{
              如果（typeof _this.debug ===“ function”）{
                _this.debug（“ <<< PONG”）;
              }
              返回;
            }
            如果（typeof _this.debug ===“ function”）{
              _this.debug（“ <<<” +数据）;
            }
            _ref = Frame.unmarshall（data）;
            _results = [];
            对于（_i = 0，_len = _ref.length; _i <_len; _i ++）{
              框架= _ref [_i];
              开关（frame.command）{
                情况“已连接”：
                  如果（typeof _this.debug ===“ function”）{
                    _this.debug（“已连接到服务器” + frame.headers.server）;
                  }
                  _this.connected = true;
                  _this._setupHeartbeat（frame.headers）;
                  _results.push（typeof _this.connectCallback ===“ function”？_this.connectCallback（frame）：void 0）;
                  打破;
                案例“ MESSAGE”：
                  subscription = frame.headers.subscription;
                  onreceive = _this.subscriptions [subscription] || _this.onreceive;
                  如果（未收到）{
                    客户= _this;
                    messageID = frame.headers [“ message-id”];
                    frame.ack =函数（标题）{
                      if（headers == null）{
                        标头= {};
                      }
                      返回client.ack（messageID，subscription，标头）;
                    };
                    frame.nack =函数（标题）{
                      if（headers == null）{
                        标头= {};
                      }
                      返回client.nack（messageID，subscription，标头）;
                    };
                    _results.push（onreceive（frame））;
                  }其他{
                    _results.push（typeof _this.debug ===“ function”？_this.debug（“未处理的收到消息：” + frame）：void 0）;
                  }
                  打破;
                案例“ RECEIPT”：
                  _results.push（typeof _this.onreceipt ===“ function”？_this.onreceipt（frame）：void 0）;
                  打破;
                情况“ ERROR”：
                  _results.push（typeof errorCallback ===“ function”？errorCallback（frame）：void 0）;
                  打破;
                默认：
                  _results.push（typeof _this.debug ===“ function”？_this.debug（“ Unhandled frame：” + frame）：void 0）;
              }
            }
            返回_results;
          };
        }）（这个）;
        this.ws.onclose =（function（_this）{
          return function（）{
            var msg;
            msg =“哇！失去与” + _this.ws.url的连接；
            如果（typeof _this.debug ===“ function”）{
              _this.debug（msg）;
            }
            _this._cleanUp（）;
            返回typeof errorCallback ===“ function”吗？errorCallback（msg）：无效0;
          };
        }）（这个）;
        返回this.ws.onopen =（function（_this）{
          return function（）{
            如果（typeof _this.debug ===“ function”）{
              _this.debug（'Web Socket Opened ...'）;
            }
            headers [“ accept-version”] = Stomp.VERSIONS.supportedVersions（）;
            headers [“ heart-beat”] = [_this.heartbeat.outgoing，_this.heartbeat.incoming] .join（'，'）;
            返回_this._transmit（“ CONNECT”，headers）;
          };
        }）（这个）;
      };
  
      Client.prototype.disconnect = function（disconnectCallback，标头）{
        if（headers == null）{
          标头= {};
        }
        this._transmit（“ DISCONNECT”，标头）;
        this.ws.onclose = null;
        this.ws.close（）;
        this._cleanUp（）;
        返回typeof offlineCallback ===“功能”？connectedCallback（）：无效0;
      };
  
      Client.prototype._cleanUp = function（）{
        this.connected = false;
        如果（this.pinger）{
          Stomp.clearInterval（this.pinger）;
        }
        如果（this.ponger）{
          返回Stomp.clearInterval（this.ponger）;
        }
      };
  
      Client.prototype.send = function（目的地，标头，正文）{
        if（headers == null）{
          标头= {};
        }
        如果（body == null）{
          正文='';
        }
        headers.destination =目的地；
        返回this._transmit（“ SEND”，标头，正文）;
      };
  
      Client.prototype.subscribe = function（目标，回调，标头）{
        var client;
        if（headers == null）{
          标头= {};
        }
        如果（！headers.id）{
          headers.id =“ sub-” + this.counter ++;
        }
        headers.destination =目的地；
        this.subscriptions [headers.id] =回调；
        this._transmit（“ SUBSCRIBE”，标头）;
        客户=这个；
        返回{
          id：headers.id，
          退订：function（）{
            返回client.unsubscribe（headers.id）;
          }
        };
      };
  
      Client.prototype.unsubscribe = function（id）{
        删除this.subscriptions [id];
        返回this._transmit（“ UNSUBSCRIBE”，{
          id：id
        }）;
      };
  
      Client.prototype.begin = function（transaction）{
        var client，txid;
        txid =交易|| “ tx-” + this.counter ++;
        this._transmit（“ BEGIN”，{
          交易：txid
        }）;
        客户=这个；
        返回{
          id：txid，
          提交：function（）{
            返回client.commit（txid）;
          }，
          中止：function（）{
            返回client.abort（txid）;
          }
        };
      };
  
      Client.prototype.commit = function（transaction）{
        返回this._transmit（“ COMMIT”，{
          交易：交易
        }）;
      };
  
      Client.prototype.abort = function（transaction）{
        返回this._transmit（“ ABORT”，{
          交易：交易
        }）;
      };
  
      Client.prototype.ack =函数（消息ID，订阅，标头）{
        if（headers == null）{
          标头= {};
        }
        headers [“ message-id”] = messageID;
        headers.subscription =订阅；
        返回this._transmit（“ ACK”，headers）;
      };
  
      Client.prototype.nack = function（消息ID，订阅，标头）{
        if（headers == null）{
          标头= {};
        }
        headers [“ message-id”] = messageID;
        headers.subscription =订阅；
        返回this._transmit（“ NACK”，headers）;
      };
  
      返回客户；
  
    }）（）;
  
    践踏= {
      版本：{
        V1_0：“ 1.0”，
        V1_1：“ 1.1”，
        V1_2：“ 1.2”，
        supportVersions：function（）{
          返回'1.1,1.0';
        }
      }，
      客户：功能（网址，协议）{
        var klass，ws;
        if（protocols == null）{
          协议= ['v10.stomp'，'v11.stomp'];
        }
        klass = Stomp.WebSocketClass || WebSocket；
        ws = new klass（网址，协议）；
        返回新的客户（ws）；
      }，
      以上：function（ws）{
        返回新的客户（ws）；
      }，
      框架：框架
    };
  
    如果（typeof出口！==“未定义” &&出口！== null）{
      出口=践踏;
    }
  
    if（typeof window！==“ undefined” && window！== null）{
      Stomp.setInterval = function（interval，f）{
        返回window.setInterval（f，interval）;
      };
      Stomp.clearInterval = function（id）{
        返回window.clearInterval（id）;
      };
      window.Stomp =践踏;
    } else if（！exports）{
      self.Stomp =践踏；
    }
  
  }）。call（this）;
  