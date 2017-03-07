/**
 * Created by nicholas on 17-3-7.
 */
'use strict';

const KoaMetrics = require('koa-metrics');
const {Monitor} = require('aliyun-monitor');
const arguejs = require('arguejs');
const events = require('events');
const emitter = new events.EventEmitter();

function hostname() {

}

function createResponseTimeMonitor(namespace, metricName) {
    let args = arguejs({
        namespace: String,
        metricName: String
    }, arguments);
    let monitor = new Monitor(args.namespace, args.metricName, 'Milliseconds', ['method', 'url', 'hostname']);
    emitter.on('metric', (metric) => {
        monitor.batchReport({
            method: metric.method,
            url: metric.url,
            hostname: hostname(),
            value: metric.duration
        });
    });
    return monitor;
}

function createRequestCountMonitor(namespace, metricName) {
    let args = arguejs({
        namespace: String,
        metricName: String
    }, arguments);
    let monitor = new Monitor(args.namespace, args.metricName, 'Count', ['method', 'url', 'hostname']);
    emitter.on('metric', (metric) => {
        monitor.batchReport({
            method: metric.method,
            url: metric.url,
            hostname: hostname(),
            value: 1
        });
    });
    return monitor;
}

exports = module.exports = KoaMetrics((metric) => {
    emitter.emit('metric', metric);
});

exports.createResponseTimeMonitor = createResponseTimeMonitor;
exports.createRequestCountMonitor = createRequestCountMonitor;
exports.Emitter = emitter;