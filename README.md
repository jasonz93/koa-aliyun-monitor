# koa-aliyun-monitor
A monitor middleware integrated with koa-monitor and aliyun-monitor

## Quick start
### 准备工作
1. 在阿里云监控控制台创建自定义规则，设置字段为`method,url,hostname`
2. 若要监控响应时间，选择单位为Milliseconds；监控请求次数，选择Count；注意：**一个监控项只能监控一个指标**
3. 记录新创建规则的命名空间为`namespace`，监控项名称为`metricName`

### Example code
```javascript
const Monitor = require('koa-aliyun-monitor');
const Koa = require('koa');

let app = new Koa();
app.use(Monitor);

Monitor.createResponseTimeMonitor('your namespace', 'your metricName');
Monitor.createRequestCountMonitor('another namespace', 'another metricName');

//Add other all middlewares after this
// app.use(some middleware);

app.listen();
```