int leftPin = A0;
int upPin = A4;
int rightPin = A8;
int downPin = A12;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(A1,OUTPUT);
  pinMode(A3,OUTPUT);
}

void loop() {
  digitalWrite(A1,LOW);
  digitalWrite(A3,LOW);
  digitalWrite(leftPin,LOW);
  Serial.print(digitalRead(leftPin));
  Serial.print(",");

  delay(50);

  digitalWrite(upPin,LOW);
  Serial.print(digitalRead(upPin));
  Serial.print(",");

  delay(50);
  
  digitalWrite(rightPin,LOW);
  Serial.print(digitalRead(rightPin));
  Serial.print(",");

  delay(50);

  digitalWrite(downPin,LOW);
  Serial.print(digitalRead(downPin));
  Serial.print("\n");

  delay(50);
}
