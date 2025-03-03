"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.a = void 0;
let a = "hello"; // 유니언 타이핑
exports.a = a;
exports.a = a = 123;
let arr = []; // 배열 타이핑
arr.push("hello");
const b = { hello: "interface" };
const c = { hello: "type" };
const m = { x: 1, y: 2 };
