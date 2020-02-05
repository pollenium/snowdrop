"use strict";
exports.__esModule = true;
var index_1 = require("./index");
test('snowdrop', function () {
    var snowdrop = new index_1.Snowdrop();
    var emittedCount = 0;
    snowdrop.addHandle(function () {
        emittedCount += 1;
    });
    snowdrop.emit();
    expect(emittedCount).toBe(1);
});
