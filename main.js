// main.js

// Emscriptenが生成したモジュールを読み込む
const Module = require("./reverse.js");

// Wasmの初期化完了を待つ
Module.onRuntimeInitialized = function () {
  console.log("✅ WebAssemblyモジュールの準備が完了しました。");

  // --- これがWasmと連携する核心部分 ---

  // 1. 処理したいJavaScriptの配列を用意
  const originalArray = new Int32Array([1, 2, 3, 4, 5, 6, 7]);
  console.log("変更前の配列:", originalArray);

  // 2. Wasmのメモリ空間に、この配列を格納するための領域を確保
  //    確保したメモリの先頭アドレス(ポインタ)が返ってくる
  const buffer = Module._malloc(
    originalArray.length * originalArray.BYTES_PER_ELEMENT
  );

  // 3. JavaScriptの配列データを、確保したWasmのメモリ領域に書き込む
  //    Module.HEAP32 は32ビット整数(int)用のメモリビュー
  Module.HEAP32.set(originalArray, buffer / 4);

  // 4. C++の `reverse_array` 関数を呼び出す！
  //    引数は (メモリの先頭アドレス, 配列の要素数)
  Module._reverse_array(buffer, originalArray.length);

  // 5. Wasmのメモリから処理結果を新しいJSの配列にコピーして取り出す
  const resultArray = new Int32Array(
    Module.HEAP32.buffer, // Wasmのメモリ全体
    buffer, // 読み取り開始アドレス
    originalArray.length // 読み取る要素数
  );
  console.log("変更後の配列:", resultArray);

  // 6. 最後に、確保したメモリを必ず解放する (メモリリークを防ぐため)
  Module._free(buffer);
};
