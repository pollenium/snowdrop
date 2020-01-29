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
var EmitWithoutHandlesError = /** @class */ (function (_super) {
    __extends(EmitWithoutHandlesError, _super);
    function EmitWithoutHandlesError() {
        return _super.call(this, 'Emitted without any handles') || this;
    }
    return EmitWithoutHandlesError;
}(SnowdropError));
exports.EmitWithoutHandlesError = EmitWithoutHandlesError;
var RemovingNonExistantHandleError = /** @class */ (function (_super) {
    __extends(RemovingNonExistantHandleError, _super);
    function RemovingNonExistantHandleError(handleId) {
        return _super.call(this, "Trying to remove a handle that doesn't exist: " + handleId.value) || this;
    }
    return RemovingNonExistantHandleError;
}(SnowdropError));
exports.RemovingNonExistantHandleError = RemovingNonExistantHandleError;
var HandleId = /** @class */ (function () {
    function HandleId(value) {
        this.value = value;
    }
    HandleId.prototype.genNext = function () {
        return new HandleId(this.value + 1);
    };
    return HandleId;
}());
exports.HandleId = HandleId;
var Snowdrop = /** @class */ (function () {
    function Snowdrop() {
        this.nextHandleId = new HandleId(0);
        this.handlesById = {};
        this.handlesCount = 0;
    }
    Snowdrop.prototype.addHandle = function (handle) {
        var handleId = this.nextHandleId;
        this.handlesById[handleId.value] = handle;
        this.nextHandleId = this.nextHandleId.genNext();
        this.handlesCount += 1;
        return handleId;
    };
    Snowdrop.prototype.removeHandleById = function (id) {
        var handle = this.handlesById[id.value];
        if (!handle) {
            throw new RemovingNonExistantHandleError(id);
        }
        delete this.handlesById[id.value];
        this.handlesCount -= 1;
    };
    Snowdrop.prototype.removeAllHandles = function () {
        for (var value = 0; value < this.nextHandleId.value; value++) {
            if (this.handlesById[value]) {
                this.removeHandleById(new HandleId(value));
            }
        }
    };
    Snowdrop.prototype.emit = function (data) {
        if (this.handlesCount === 0) {
            throw new EmitWithoutHandlesError();
        }
        for (var i = 0; i < this.nextHandleId.value; i++) {
            var handle = this.handlesById[i];
            if (handle) {
                handle(data);
            }
        }
    };
    Snowdrop.prototype.emitIfHandle = function (data) {
        if (this.handlesCount > 0) {
            this.emit(data);
        }
    };
    return Snowdrop;
}());
exports.Snowdrop = Snowdrop;
