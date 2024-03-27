function fibonacci(n) {
    if (n == 0 || n == 1) {
        return n;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}

let startTime = Date.now();
let totalCount = 500;
let completedCount = 0;
let n = 35;

for (let i = 0; i < totalCount; i++) {
    fibonacci(n);
    completedCount++;
    console.log(`process: ${completedCount}/${totalCount}`);
}
console.log("👏 👏 👏 👏 👏 👏 👏 👏 👏 👏");
console.info(`任务完成，用时: ${Date.now() - startTime}ms`);
console.log("👏 👏 👏 👏 👏 👏 👏 👏 👏 👏");
