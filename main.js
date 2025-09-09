// main.js

// Emscriptenが生成したモジュールを読み込む
import Module from "./reverse.js";

// ES6モジュール形式では、Moduleは非同期で初期化される
const moduleInstance = await Module();

console.log("✅ WebAssemblyモジュールの準備が完了しました。");

// --- これがWasmと連携する核心部分 ---

// 1~9の値が10万個入っている配列を作成
const arr = new Int32Array(100000);
for (let i = 0; i < 100000; i++) {
  arr[i] = (i % 9) + 1; // 1~9を繰り返し
}

// 1. 処理したいJavaScriptの配列を用意
const originalArray = arr;
console.log("変更前の配列（最初の10個）:", Array.from(originalArray));
console.log("配列の長さ:", originalArray.length);

// 2. Wasmのメモリ空間に、この配列を格納するための領域を確保
//    確保したメモリの先頭アドレス(ポインタ)が返ってくる
const requiredBytes = originalArray.length * originalArray.BYTES_PER_ELEMENT;
console.log(`--- 必要なメモリサイズ: ${requiredBytes}バイト ---`);

const buffer = moduleInstance._malloc(requiredBytes);

// 3. JavaScriptの配列データを、確保したWasmのメモリ領域に書き込む
//    moduleInstance.HEAP32 は32ビット整数(int)用のメモリビュー
moduleInstance.HEAP32.set(originalArray, buffer / 4);

// 4. C++の `reverse_array` 関数を呼び出す！
//    引数は (メモリの先頭アドレス, 配列の要素数)
console.log("--- WebAssembly処理開始 ---");
const startTime = performance.now();

moduleInstance._reverse_array(buffer, originalArray.length);

const endTime = performance.now();
const processingTime = endTime - startTime;

console.log("--- WebAssembly処理完了 ---");
console.log(`処理時間: ${processingTime.toFixed(2)}ミリ秒`);

// 5. Wasmのメモリから処理結果を新しいJSの配列にコピーして取り出す
const resultArray = new Int32Array(
  moduleInstance.HEAP32.buffer, // Wasmのメモリ全体
  buffer, // 読み取り開始アドレス
  originalArray.length // 読み取る要素数
);
console.log(
  "変更後の配列（最初の10個）:",
  Array.from(resultArray.slice(0, 10))
);

// 6. 最後に、確保したメモリを必ず解放する (メモリリークを防ぐため)
moduleInstance._free(buffer);
