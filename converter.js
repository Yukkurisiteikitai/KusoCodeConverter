// UUIDを生成する関数
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// クソコードに変換する関数
function convertToKusoCode(code) {
    let uuidVars = {};
    let modifiedCode = code;

    // 変数宣言の正規表現
    let variableDeclarationRegex = /(\bvar\b|\blet\b|\bconst\b)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let match;

    // 変数宣言をそのままにし、後で使用される変数のみ関数化
    while ((match = variableDeclarationRegex.exec(code)) !== null) {
        let originalVar = match[2];
        let uuid = generateUUID().replace(/-/g, '_');
        uuidVars[originalVar] = uuid;

        // 変数が再度使われた場合に関数化するための置換処理
        let variableUsageRegex = new RegExp(`\\b${originalVar}\\b`, 'g');
        let functionName = `get_${uuid}`;

        // 最初の変数宣言部分は変更せず、その後に出てきた変数の使用部分だけを関数に置き換える
        modifiedCode = modifiedCode.replace(variableUsageRegex, function(match, offset) {
            // 最初の宣言箇所では置き換えない
            if (offset > variableDeclarationRegex.lastIndex) {
                return `${functionName}()`;
            }
            return match;
        });

        // 関数を定義して、元の変数名の再使用箇所をすべて関数呼び出しに置き換える
        let functionDefinition = `function ${functionName}() { for (var I = 0; I < 1; I++){{{ return ${originalVar}; }}} }\n`;
        modifiedCode = functionDefinition + modifiedCode;
    }

    // getElementById や appendChild などを関数化
    modifiedCode = modifiedCode.replace(/document\.getElementById\((.*?)\)/g, function(match, p1) {
        let uuid = generateUUID().replace(/-/g, '_');
        return `get_${uuid}(${p1})`;

    }).replace(/document\.body\.appendChild\((.*?)\)/g, function(match, p1) {
        let uuid = generateUUID().replace(/-/g, '_');
        return `get_${uuid}(${p1})`;
    });

    // 必要なドキュメント操作の関数定義を追加
    modifiedCode = `function get_${generateUUID().replace(/-/g, '_')}(id) { 
        for (var I = 0; I < 1; I++){{{ 
            return document.getElementById(id); 
        }}} 
    }\n` + modifiedCode;

    modifiedCode = `function get_${generateUUID().replace(/-/g, '_')}(element) { 
        for (var I = 0; I < 1; I++){{{ 
            document.body.appendChild(element); 
        }}} 
    }\n` + modifiedCode;

    // 無駄なネストとforループを追加
    modifiedCode = addKusoElements(modifiedCode);

    return modifiedCode;
}

// クソコードのパターンを追加する関数
function addKusoElements(code) {
    // 無駄なネストとforループを追加
    code = `(function(){{{for(var I = 0; I < 1; I++){{{\n${code}\n}}}}}})();`;

    return code;
}

// イベントリスナーを設定
document.getElementById('convertButton').addEventListener('click', function() {
    let inputCode = document.getElementById('inputCode').value;
    let kusoCode = convertToKusoCode(inputCode);
    document.getElementById('outputCode').value = kusoCode;
});


//生成したクソコードを実行する



//クソコード実行ボタンが押されたら
