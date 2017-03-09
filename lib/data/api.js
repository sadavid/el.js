// Generated by CoffeeScript 1.10.0
var Api, ScheduledTask, ScheduledTaskType, apis, log, promise, requestAnimationFrame, timeNow, utils, xhr;

utils = require('../utils');

promise = utils.shim.promise;

xhr = utils.shim.xhr;

log = utils.log;

requestAnimationFrame = utils.shim.requestAnimationFrame;

timeNow = Date.now || function() {
  return new Date().getTime();
};

ScheduledTaskType = {
  every: 'every',
  once: 'once'
};

ScheduledTask = (function() {
  function ScheduledTask(type, fn1, millis1) {
    this.type = type;
    this.fn = fn1;
    this.millis = millis1;
    this.scheduledTime = timeNow() + this.millis;
    this.kill = false;
  }

  ScheduledTask.prototype.cancel = function() {
    return this.kill = true;
  };

  return ScheduledTask;

})();

apis = {};

Api = (function() {
  Api.prototype.scheduledTasks = null;

  Api.prototype.url = '';

  Api.prototype.token = '';

  function Api(url1, token) {
    var url;
    this.url = url1 != null ? url1 : '';
    this.token = token != null ? token : '';
    this.scheduledTasks = [];
    url = this.url;
    if (url[url.length - 1] === '/') {
      this.url = url.substring(0, url.length - 1);
    }
  }

  Api.get = function(name) {
    if (name == null) {
      name = '';
    }
    return apis[name];
  };

  Api.prototype.register = function(name) {
    if (name == null) {
      name = '';
    }
    return apis[name] = this;
  };

  Api.prototype.get = function(path, data, headers) {
    var p;
    if (headers == null) {
      headers = {};
    }
    if (this.token) {
      headers.Authorization = this.token;
    }
    p = path;
    if (p[0] !== '/') {
      p = '/' + path;
    }
    return xhr({
      method: 'GET',
      contentType: "application/json",
      headers: headers,
      url: this.url + p,
      data: JSON.stringify(data)
    });
  };

  Api.prototype.post = function(path, data, headers) {
    var p;
    if (headers == null) {
      headers = {};
    }
    if (this.token) {
      headers.Authorization = this.token;
    }
    p = path;
    if (p[0] !== '/') {
      p = '/' + path;
    }
    return xhr({
      method: 'POST',
      contentType: "application/json",
      headers: headers,
      url: this.url + p,
      data: JSON.stringify(data)
    });
  };

  Api.prototype.put = function(path, data, headers) {
    var p;
    if (headers == null) {
      headers = {};
    }
    if (this.token) {
      headers.Authorization = this.token;
    }
    p = path;
    if (p[0] !== '/') {
      p = '/' + path;
    }
    return xhr({
      method: 'PUT',
      contentType: "application/json",
      headers: headers,
      url: this.url + p,
      data: JSON.stringify(data)
    });
  };

  Api.prototype.patch = function(path, data, headers) {
    var p;
    if (headers == null) {
      headers = {};
    }
    if (this.token) {
      headers.Authorization = this.token;
    }
    p = path;
    if (p[0] !== '/') {
      p = '/' + path;
    }
    return xhr({
      method: 'PATCH',
      contentType: "application/json",
      headers: headers,
      url: this.url + p,
      data: JSON.stringify(data)
    });
  };

  Api.prototype["delete"] = function(path, data, headers) {
    var p;
    if (headers == null) {
      headers = {};
    }
    if (this.token) {
      headers.Authorization = this.token;
    }
    p = path;
    if (p[0] !== '/') {
      p = '/' + path;
    }
    return xhr({
      method: 'DELETE',
      contentType: "application/json",
      headers: headers,
      url: this.url + p,
      data: JSON.stringify(data)
    });
  };

  Api.prototype.scheduleOnce = function(fn, millis) {
    var task;
    task = new ScheduledTask(ScheduledTaskType.once, fn, millis);
    this.scheduledTasks.push(task);
    if (this.scheduledTasks.length === 1) {
      this.loop();
    }
    return task;
  };

  Api.prototype.scheduleEvery = function(fn, millis, now) {
    var task;
    if (now == null) {
      now = false;
    }
    task = new ScheduledTask(ScheduledTaskType.every, fn, millis);
    this.scheduledTasks.push(task);
    if (this.scheduledTasks.length === 1) {
      this.loop();
    }
    if (now) {
      log('API: scheduling for immediate execution');
      task = new ScheduledTask(ScheduledTaskType.once, fn, 0);
      this.scheduledTasks.push(task);
    }
    return task;
  };

  Api.prototype.loop = function() {
    if (this.scheduledTasks.length > 0) {
      log('API: starting loop');
      return requestAnimationFrame((function(_this) {
        return function() {
          var i, length, now, sfn;
          now = timeNow();
          i = 0;
          length = _this.scheduledTasks.length;
          while (i < length) {
            sfn = _this.scheduledTasks[i];
            if (sfn.scheduledTime <= now) {
              if (!sfn.kill) {
                sfn.fn(now);
              }
              if (sfn.kill || sfn.type === ScheduledTaskType.once) {
                length--;
                _this.scheduledTasks[i] = _this.scheduledTasks[length];
              } else if (sfn.type === ScheduledTaskType.every) {
                sfn.scheduledTime += sfn.millis;
              }
            } else {
              i++;
            }
          }
          _this.scheduledTasks.length = length;
          if (length > 0) {
            return _this.loop();
          }
        };
      })(this));
    }
  };

  return Api;

})();

module.exports = Api;

//# sourceMappingURL=api.js.map