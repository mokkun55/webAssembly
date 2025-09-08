// Emscripten（C++をWebAssemblyに変換するツール）で必要なヘッダーファイル
#include <emscripten.h>
// C++の標準ライブラリから swap 関数を使うために必要
#include <algorithm>

// C言語のルールで関数を扱うことをコンパイラに伝えるおまじない
// これにより、JavaScriptから関数を呼び出しやすくなります
extern "C" {

  // この関数をJavaScriptから見えるように公開するためのおまじない
  EMSCRIPTEN_KEEPALIVE
  // ポインタ（メモリのアドレス）と配列の長さを受け取る関数
  void reverse_array(int* array, int length) {
    // 配列の前半と後半をループで入れ替えていく
    for (int i = 0; i < length / 2; ++i) {
      std::swap(array[i], array[length - 1 - i]);
    }
  }

}