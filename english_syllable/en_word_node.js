import { syllable } from './enWord.js';

// 获取命令行参数（跳过前两个系统参数）
const args = process.argv.slice(2);

// 验证参数数量
if (args.length !== 1) {
    console.error('请使用格式: node mathOperations.js 单词');
    process.exit(1);
}

// 调用方法并输出结果
const result = syllable(args[0]);
console.log('\x1B[36m%s\x1B[0m', `${result.join('-')}`);