//生成したクソコードを実行する



//クソコード実行ボタンが押されたら
document.getElementById('DoKusoCode').addEventListener('click', function() {
    let inputCode = document.getElementById('inputCode').value;
    let kusoCode = convertToKusoCode(inputCode);
    document.getElementById('outputCode').value = kusoCode;
});