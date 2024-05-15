int led_pin = 2;

// 蓝led灯，闪
void shan() {
  pinMode(led_pin, OUTPUT);

  digitalWrite(led_pin, HIGH);
  delay(1000);
  digitalWrite(led_pin, LOW);
  delay(1000);
}

// 蓝led灯，呼吸(不是pwm)
void huXi() {
  pinMode(led_pin, OUTPUT);

  // 由暗到亮
  for (int i = 0; i < 256; i++) {
    analogWrite(led_pin, i);
    delay(10);
  }
  // 由亮到暗
  for (int i = 255; i >= 0; i--) {
    analogWrite(led_pin, i);
    delay(10);
  }
}

void setup() {
  // put your setup code here, to run once:

  // // 蓝led灯闪10次
  // int count = 0;
  // while (true) {
  //   if (count >= 10) {
  //     break;
  //   }
  //   shan();
  //   count = count + 1;
  // }

  // // 蓝led灯呼吸10次
  // int count = 0;
  // while (true) {
  //   if (count >= 10) {
  //     break;
  //   }
  //   huXi();
  //   count = count + 1;
  // }
}

void loop() {
  // put your main code here, to run repeatedly:
}
