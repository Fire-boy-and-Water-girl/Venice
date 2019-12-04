//��CoffeeScript 1.7.1����

/ *
   ͨ��WebSocket��̤http://www.jmesnil.net/stomp-websocket/doc/ | Apache���֤V2.0

   ��Ȩ���У�C��2010-2013 [Jeff Mesnil]��http://jmesnil.net/��
   ��Ȩ���У�C��2012 [FuseSource��Inc.]��http://fusesource.com��
 * /
 
��function����{
    var Byte��Client��Frame��Stomp��
      __hasProp = {} .hasOwnProperty��
      __slice = [] .slice;
  
    �ֽ�= {
      LF���� \ x0A����
      NULL���� \ x00��
    };
  
    ���=��function����{
      var unmarshallSingle;
  
      ����Frame��������⣬���ģ�{
        this.command =����;
        this.headers =��ͷ��=���𣿱�ͷ��{};
        this.body = body��=�������� �� '';
      }
  
      Frame.prototype.toString = function����{
        var�У����ƣ�skipContentLength��ֵ��_ref;
        ��= [this.command];
        skipContentLength = this.headers ['content-length'] === false�����;
        �����skipContentLength��{
          ɾ��this.headers ['content-length'];
        }
        _ref = this.headers;
        Ϊ��_ref�е����ƣ�{
          �������__ hasProp.call��_ref��name��������;
          ֵ= _ref [����];
          lines.push������ +����+������ +ֵ����
        }
        �����this.body &&��skipContentLength��{
          lines.push���� content-length���� +��Frame.sizeOfUTF8��this.body������;
        }
        lines.push��Byte.LF + this.body��;
        ����lines.join��Byte.LF��;
      };
  
      Frame.sizeOfUTF8 =����{
        �����s��{
          ����encodeURI��s��.match��/��.. | ./g��.length;
        }����{
          ����0;
        }
      };
  
      unmarshallSingle =���������ݣ�{
        var body��chr��command��divider��headerLines��headers��i��idx��len��line��start��trim��_i��_j��_len��_ref��_ref1;
        ������= data.search��RegExp������ + Byte.LF + Byte.LF����;
        headerLines = data.substring��0����������.split��Byte.LF��;
        ����= headerLines.shift����;
        ��ͷ= {};
        trim = function��str��{
          ����str.replace��/ ^ \ s + | \ s + $ / g��``��;
        };
        _ref = headerLines.reverse����;
        ���ڣ�_i = 0��_len = _ref.length; _i <_len; _i ++��{
          ��= _ref [_i];
          idx = line.indexOf��'��'��;
          headers [trim��line.substring��0��idx����] = trim��line.substring��idx + 1����;
        }
        ����='';
        ��ʼ=��Ƶ��+ 2;
        �����headers ['content-length']��{
          len = parseInt��headers ['content-length']��;
          ����=��''+���ݣ�.substring��start��start + len��;
        }����{
          chr = null;
          for��i = _j =��ʼ��_ref1 = data.length;��ʼ<= _ref1��_j <_ref1��_j> _ref1; i =��ʼ<= _ref1��++ _ j��--_ j��{
            chr = data.charAt��i��;
            �����chr === Byte.NULL��{
              ����;
            }
            ����+ = chr;
          }
        }
        �����µ�Frame��command��headers��body��;
      };
  
      Frame.unmarshall =���������ݣ�{
        var���ݣ�
        ���أ�function����{
          var _i��_len��_ref��_results;
          _ref = datas.split��RegExp������ + Byte.NULL + Byte.LF +�� *������;
          _results = [];
          ���ڣ�_i = 0��_len = _ref.length; _i <_len; _i ++��{
            ����= _ref [_i];
            �������data��= null��data.length��void 0��> 0��{
              _results.push��unmarshallSingle��data����;
            }
          }
          ����_results;
        }������;
      };
  
      Frame.marshall = function��command��headers��body��{
        var frame;
        frame = new Frame��command��headers��body��;
        ����frame.toString����+ Byte.NULL;
      };
  
      ���ؿ�ܣ�
  
    }������;
  
    �ͻ���=��function����{
      var now;
  
      ����Client��ws��{
        this.ws = ws;
        this.ws.binaryType =�� arraybuffer��;
        this.counter = 0;
        this.connected = false;
        this.heartbeat = {
          ������10000��
          ���룺10000
        };
        this.maxWebSocketFrameSize = 16 * 1024;
        this.subscriptions = {};
      }
  
      Client.prototype.debug = function��message��{
        var _ref;
        ����typeof window��==��δ���塱 && window��== null����_ref = window.console����= null��''����Ч0����Ч0;
        // _ref.log����Ϣ��
    };
  
      ����= function����{
        �����Date.now��{
          ����Date.now����;
        }����{
          �����µ�Date������valueOf;
        }
      };
  
      Client.prototype._transmit = function��command��headers��body��{
        var out;
        out = Frame.marshall��������⣬���ģ�;
        �����typeof this.debug ===�� function����{
          this.debug���� >>>�� + out��;
        }
        ����true��{
          �����out.length> this.maxWebSocketFrameSize��{
            this.ws.send��out.substring��0��this.maxWebSocketFrameSize����;
            out = out.substring��this.maxWebSocketFrameSize��;
            �����typeof this.debug ===�� function����{
              this.debug���� remaining =�� + out.length��;
            }
          }����{
            ����this.ws.send��out��;
          }
        }
      };
  
      Client.prototype._setupHeartbeat = function��headers��{
        var serverIncoming��serverOutgoing��ttl��v��_ref��_ref1;
        if����_ref = headers.version����== Stomp.VERSIONS.V1_1 && _ref��== Stomp.VERSIONS.V1_2��{
          ����;
        }
        _ref1 =��function����{
          var _i��_len��_ref1��_results;
          _ref1 = headers ['heart-beat']��split����������;
          _results = [];
          ���ڣ�_i = 0��_len = _ref1.length; _i <_len; _i ++��{
            v = _ref1 [_i];
            _results.push��parseInt��v����;
          }
          ����_results;
        }��������serverOutgoing = _ref1 [0]��serverIncoming = _ref1 [1];
        ���������this.heartbeat.outgoing === 0 || serverIncoming === 0����{
          ttl = Math.max��this.heartbeat.outgoing��serverIncoming��;
          �����typeof this.debug ===�� function����{
            this.debug����ÿ��+ + ttl +�� ms������PING����
          }
          this.pinger = Stomp.setInterval��ttl����function��_this��{
            return function����{
              _this.ws.send��Byte.LF��;
              ����typeof _this.debug ===�� function����_this.debug���� >>> PING��������Ч0��
            };
          }�����������;
        }
        ���������this.heartbeat.incoming === 0 || serverOutgoing === 0����{
          ttl = Math.max��this.heartbeat.incoming��serverOutgoing��;
          �����typeof this.debug ===�� function����{
            this.debug����ÿ��+ + ttl +�� ms�����PONG����
          }
          ����this.ponger = Stomp.setInterval��ttl����function��_this��{
            return function����{
              var delta;
              delta = now����-_this.serverActivity;
              �����delta> ttl * 2��{
                �����typeof _this.debug ===�� function����{
                  _this.debug����û���յ����һ���� +����+�� ms���ķ����������
                }
                ����_this.ws.close����;
              }
            };
          }�����������;
        }
      };
  
      Client.prototype._parseConnect = function����{
        var args��connectCallback��errorCallback����ͷ��
        args = 1 <= arguments.length��__slice.call��arguments��0����[];
        ��ͷ= {};
        ���أ�args.length��{
          ���2��
            ��ͷ= args [0]��connectCallback = args [1];
            ����;
          ���3��
            if��args [1] instanceof Function��{
              ��ͷ= args [0]��connectCallback = args [1]��errorCallback = args [2];
            }����{
              headers.login = args [0]��headers.passcode = args [1]��connectCallback = args [2];
            }
            ����;
          ���4��
            headers.login = args [0]��headers.passcode = args [1]��connectCallback = args [2]��errorCallback = args [3];
            ����;
          Ĭ�ϣ�
            headers.login = args [0]��headers.passcode = args [1]��connectCallback = args [2]��errorCallback = args [3]��headers.host = args [4];
        }
        ����[headers��connectCallback��errorCallback];
      };
  
      Client.prototype.connect = function����{
        var args��errorCallback����ͷ��out;
        args = 1 <= arguments.length��__slice.call��arguments��0����[];
        out = this._parseConnect.apply��this��args��;
        ��ͷ= out [0]��this.connectCallback = out [1]��errorCallback = out [2];
        �����typeof this.debug ===�� function����{
          this.debug���� Opening Web Socket ...����;
        }
        this.ws.onmessage =��function��_this��{
          ���غ�����evt��{
            var arr��c���ͻ��ˣ����ݣ�֡��messageID��onreceive��subscription��_i��_len��_ref��_results��
            data = typeof ArrayBuffer��=='undefined'&& evt.data instanceof ArrayBuffer�𣿣�arr = new Uint8Array��evt.data����typeof _this.debug ===�� function����_this.debug���� ---�õ������ݳ��ȣ��� + arr.length����void 0��������function {} {
              var _i��_len��_results;
              _results = [];
              ���ڣ�_i = 0��_len =���ȳ���; _i <_len; _i ++��{
                c = arr [_i];
                _results.push��String.fromCharCode��c����;
              }
              ����_results;
            }����������join��''������evt.data;
            _this.serverActivity = now����;
            ���������=== Byte.LF��{
              �����typeof _this.debug ===�� function����{
                _this.debug���� <<< PONG����;
              }
              ����;
            }
            �����typeof _this.debug ===�� function����{
              _this.debug���� <<<�� +���ݣ�;
            }
            _ref = Frame.unmarshall��data��;
            _results = [];
            ���ڣ�_i = 0��_len = _ref.length; _i <_len; _i ++��{
              ���= _ref [_i];
              ���أ�frame.command��{
                ����������ӡ���
                  �����typeof _this.debug ===�� function����{
                    _this.debug���������ӵ��������� + frame.headers.server��;
                  }
                  _this.connected = true;
                  _this._setupHeartbeat��frame.headers��;
                  _results.push��typeof _this.connectCallback ===�� function����_this.connectCallback��frame����void 0��;
                  ����;
                ������ MESSAGE����
                  subscription = frame.headers.subscription;
                  onreceive = _this.subscriptions [subscription] || _this.onreceive;
                  �����δ�յ���{
                    �ͻ�= _this;
                    messageID = frame.headers [�� message-id��];
                    frame.ack =���������⣩{
                      if��headers == null��{
                        ��ͷ= {};
                      }
                      ����client.ack��messageID��subscription����ͷ��;
                    };
                    frame.nack =���������⣩{
                      if��headers == null��{
                        ��ͷ= {};
                      }
                      ����client.nack��messageID��subscription����ͷ��;
                    };
                    _results.push��onreceive��frame����;
                  }����{
                    _results.push��typeof _this.debug ===�� function����_this.debug����δ������յ���Ϣ���� + frame����void 0��;
                  }
                  ����;
                ������ RECEIPT����
                  _results.push��typeof _this.onreceipt ===�� function����_this.onreceipt��frame����void 0��;
                  ����;
                ����� ERROR����
                  _results.push��typeof errorCallback ===�� function����errorCallback��frame����void 0��;
                  ����;
                Ĭ�ϣ�
                  _results.push��typeof _this.debug ===�� function����_this.debug���� Unhandled frame���� + frame����void 0��;
              }
            }
            ����_results;
          };
        }���������;
        this.ws.onclose =��function��_this��{
          return function����{
            var msg;
            msg =���ۣ�ʧȥ�롱 + _this.ws.url�����ӣ�
            �����typeof _this.debug ===�� function����{
              _this.debug��msg��;
            }
            _this._cleanUp����;
            ����typeof errorCallback ===�� function����errorCallback��msg������Ч0;
          };
        }���������;
        ����this.ws.onopen =��function��_this��{
          return function����{
            �����typeof _this.debug ===�� function����{
              _this.debug��'Web Socket Opened ...'��;
            }
            headers [�� accept-version��] = Stomp.VERSIONS.supportedVersions����;
            headers [�� heart-beat��] = [_this.heartbeat.outgoing��_this.heartbeat.incoming] .join��'��'��;
            ����_this._transmit���� CONNECT����headers��;
          };
        }���������;
      };
  
      Client.prototype.disconnect = function��disconnectCallback����ͷ��{
        if��headers == null��{
          ��ͷ= {};
        }
        this._transmit���� DISCONNECT������ͷ��;
        this.ws.onclose = null;
        this.ws.close����;
        this._cleanUp����;
        ����typeof offlineCallback ===�����ܡ���connectedCallback��������Ч0;
      };
  
      Client.prototype._cleanUp = function����{
        this.connected = false;
        �����this.pinger��{
          Stomp.clearInterval��this.pinger��;
        }
        �����this.ponger��{
          ����Stomp.clearInterval��this.ponger��;
        }
      };
  
      Client.prototype.send = function��Ŀ�ĵأ���ͷ�����ģ�{
        if��headers == null��{
          ��ͷ= {};
        }
        �����body == null��{
          ����='';
        }
        headers.destination =Ŀ�ĵأ�
        ����this._transmit���� SEND������ͷ�����ģ�;
      };
  
      Client.prototype.subscribe = function��Ŀ�꣬�ص�����ͷ��{
        var client;
        if��headers == null��{
          ��ͷ= {};
        }
        �������headers.id��{
          headers.id =�� sub-�� + this.counter ++;
        }
        headers.destination =Ŀ�ĵأ�
        this.subscriptions [headers.id] =�ص���
        this._transmit���� SUBSCRIBE������ͷ��;
        �ͻ�=�����
        ����{
          id��headers.id��
          �˶���function����{
            ����client.unsubscribe��headers.id��;
          }
        };
      };
  
      Client.prototype.unsubscribe = function��id��{
        ɾ��this.subscriptions [id];
        ����this._transmit���� UNSUBSCRIBE����{
          id��id
        }��;
      };
  
      Client.prototype.begin = function��transaction��{
        var client��txid;
        txid =����|| �� tx-�� + this.counter ++;
        this._transmit���� BEGIN����{
          ���ף�txid
        }��;
        �ͻ�=�����
        ����{
          id��txid��
          �ύ��function����{
            ����client.commit��txid��;
          }��
          ��ֹ��function����{
            ����client.abort��txid��;
          }
        };
      };
  
      Client.prototype.commit = function��transaction��{
        ����this._transmit���� COMMIT����{
          ���ף�����
        }��;
      };
  
      Client.prototype.abort = function��transaction��{
        ����this._transmit���� ABORT����{
          ���ף�����
        }��;
      };
  
      Client.prototype.ack =��������ϢID�����ģ���ͷ��{
        if��headers == null��{
          ��ͷ= {};
        }
        headers [�� message-id��] = messageID;
        headers.subscription =���ģ�
        ����this._transmit���� ACK����headers��;
      };
  
      Client.prototype.nack = function����ϢID�����ģ���ͷ��{
        if��headers == null��{
          ��ͷ= {};
        }
        headers [�� message-id��] = messageID;
        headers.subscription =���ģ�
        ����this._transmit���� NACK����headers��;
      };
  
      ���ؿͻ���
  
    }������;
  
    ��̤= {
      �汾��{
        V1_0���� 1.0����
        V1_1���� 1.1����
        V1_2���� 1.2����
        supportVersions��function����{
          ����'1.1,1.0';
        }
      }��
      �ͻ������ܣ���ַ��Э�飩{
        var klass��ws;
        if��protocols == null��{
          Э��= ['v10.stomp'��'v11.stomp'];
        }
        klass = Stomp.WebSocketClass || WebSocket��
        ws = new klass����ַ��Э�飩��
        �����µĿͻ���ws����
      }��
      ���ϣ�function��ws��{
        �����µĿͻ���ws����
      }��
      ��ܣ����
    };
  
    �����typeof���ڣ�==��δ���塱 &&���ڣ�== null��{
      ����=��̤;
    }
  
    if��typeof window��==�� undefined�� && window��== null��{
      Stomp.setInterval = function��interval��f��{
        ����window.setInterval��f��interval��;
      };
      Stomp.clearInterval = function��id��{
        ����window.clearInterval��id��;
      };
      window.Stomp =��̤;
    } else if����exports��{
      self.Stomp =��̤��
    }
  
  }����call��this��;
  