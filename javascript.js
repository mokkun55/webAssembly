// javascript.js - JavaScriptで同じ配列反転処理を実装

console.log("✅ JavaScriptでの配列反転処理を開始します。");

// 1~9の値が10万個入っている配列を作成
const arr = new Int32Array(100000);
for (let i = 0; i < 100000; i++) {
  arr[i] = (i % 9) + 1; // 1~9を繰り返し
}

// 1. 処理したいJavaScriptの配列を用意
const originalArray = arr;
console.log(
  "変更前の配列（最初の10個）:",
  Array.from(originalArray.slice(0, 10))
);
console.log("配列の長さ:", originalArray.length);

// 2. JavaScriptで配列を反転する関数
function reverseArray(array) {
  const result = new Int32Array(array.length);

  // 配列の前半と後半をループで入れ替えていく（WebAssemblyと同じロジック）
  for (let i = 0; i < array.length / 2; ++i) {
    // std::swap(array[i], array[length - 1 - i]) と同じ処理
    const temp = array[i];
    result[i] = array[array.length - 1 - i];
    result[array.length - 1 - i] = temp;
  }

  // 中央の要素（配列長が奇数の場合）をコピー
  if (array.length % 2 === 1) {
    result[Math.floor(array.length / 2)] = array[Math.floor(array.length / 2)];
  }

  return result;
}

// 3. 処理時間を測定
console.log("--- JavaScript処理開始 ---");
const startTime = performance.now();

// 4. JavaScriptの `reverseArray` 関数を呼び出す！
const resultArray = reverseArray(originalArray);

const endTime = performance.now();
const processingTime = endTime - startTime;

console.log("--- JavaScript処理完了 ---");
console.log(`処理時間: ${processingTime.toFixed(2)}ミリ秒`);

// 5. 結果を表示
console.log(
  "変更後の配列（最初の10個）:",
  Array.from(resultArray.slice(0, 10))
);

// 6. メモリ使用量の確認
const memoryUsage = process.memoryUsage();
console.log("--- メモリ使用量 ---");
console.log(`RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)}MB`);
console.log(`Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`);
console.log(
  `Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`
);

console.log("✅ JavaScriptでの配列反転処理が完了しました。");
