"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var SnowdropError = /** @class */ (function (_super) {
    __extends(SnowdropError, _super);
    function SnowdropError(message) {
        return _super.call(this, "Snowdrop: " + message) || this;
    }
    return SnowdropError;
}(Error));
exports.SnowdropError = SnowdropError;
var RemovingNonExistantHandleError = /** @class */ (function (_super) {
    __extends(RemovingNonExistantHandleError, _super);
    function RemovingNonExistantHandleError(handleId) {
        return _super.call(this, "Trying to remove a handle that doesn't exist: " + handleId) || this;
    }
    return RemovingNonExistantHandleError;
}(SnowdropError));
exports.RemovingNonExistantHandleError = RemovingNonExistantHandleError;
var ExceedsMaxEmitsCountError = /** @class */ (function (_super) {
    __extends(ExceedsMaxEmitsCountError, _super);
    function ExceedsMaxEmitsCountError(maxEmitsCount) {
        return _super.call(this, "Trying to emit beyound maxEmitsCount of " + maxEmitsCount) || this;
    }
    return ExceedsMaxEmitsCountError;
}(SnowdropError));
exports.ExceedsMaxEmitsCountError = ExceedsMaxEmitsCountError;
var Snowdrop = /** @class */ (function () {
    function Snowdrop(options) {
        this.options = {
            maxEmitsCount: null
        };
        this.nextHandleId = 0;
        this.handlesById = {};
        this.handlesCount = 0;
        this.emitsCount = 0;
        if (options) {
            this.options = Object.assign(this.options, options);
        }
    }
    Snowdrop.prototype.addHandle = function (handle) {
        var handleId = this.nextHandleId;
        this.handlesById[handleId] = handle;
        this.nextHandleId += 1;
        this.handlesCount += 1;
        return handleId;
    };
    Snowdrop.prototype.removeHandleById = function (id) {
        var handle = this.handlesById[id];
        if (!handle) {
            throw new RemovingNonExistantHandleError(id);
        }
        delete this.handlesById[id];
        this.handlesCount -= 1;
    };
    Snowdrop.prototype.removeAllHandles = function () {
        for (var value = 0; value < this.nextHandleId; value++) {
            if (this.handlesById[value]) {
                this.removeHandleById(value);
            }
        }
    };
    Snowdrop.prototype.emit = function (data) {
        if (this.options.maxEmitsCount !== null) {
            if (this.emitsCount === this.options.maxEmitsCount) {
                throw new ExceedsMaxEmitsCountError(this.options.maxEmitsCount);
            }
        }
        this.emitsCount += 1;
        for (var i = 0; i < this.nextHandleId; i++) {
            var handle = this.handlesById[i];
            if (handle) {
                handle(data);
            }
        }
    };
    return Snowdrop;
}());
exports.Snowdrop = Snowdrop;
