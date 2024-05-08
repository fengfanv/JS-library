import json

data = {
    "name": "John",
    "age": 20,
    "city": "New York"
}

# 对象obj 转 json字符串
jsonStr = json.dumps(data)
print(jsonStr)  # {"name": "John", "age": 20, "city": "New York"}
print(type(jsonStr))  # <class 'str'>

# json字符串 转 obj对象
resData = json.loads(jsonStr)
print(resData["age"])  # 20
