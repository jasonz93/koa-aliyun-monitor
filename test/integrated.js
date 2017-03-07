/**
 * Created by nicholas on 17-3-7.
 */
const Koa = require('koa');
const request = require('supertest');
const {expect} = require('chai');
const Monitor = require('../');

describe('Test koa-metrics integrated with aliyun-monitor', () => {
    let app = new Koa();
    app.use(Monitor);

    it('Test response time monitor', function (done) {
        this.timeout(10000);
        let monitor = Monitor.createResponseTimeMonitor('ACS/CUSTOM/1121930929925232', 'nodejs_response_time');
        monitor.on('error', (err) => {
            done(err);
        });
        let responseTime;
        Monitor.Emitter.on('metric', (metric) => {
            responseTime = metric.duration;
        });
        monitor.on('report', (payload) => {
            expect(payload.length).to.be.equal(1);
            expect(payload[0].value).to.be.equal(responseTime);
            done();
        });
        request(app.listen()).get('/test/monitor').end((err, res) => {
            expect(err).to.be.equal(null);
        });
    });

    it('Test request count monitor', function (done) {
        this.timeout(10000);
        let monitor = Monitor.createRequestCountMonitor('ACS/CUSTOM/1121930929925232', 'nodejs_response_time');
        monitor.on('error', (err) => {
            done(err);
        });
        monitor.on('report', (payload) => {
            expect(payload.length).to.be.equal(1);
            expect(payload[0].value).to.be.equal(1);
            done();
        });
        request(app.listen()).get('/test/monitor').end((err, res) => {
            expect(err).to.be.equal(null);
        });
    });
});