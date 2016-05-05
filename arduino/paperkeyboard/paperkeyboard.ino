int leftPin = A15;
int upPin = A4;
int rightPin = A9;
int downPin = A12;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(A1,OUTPUT);
  pinMode(A3,OUTPUT);
}

void loop() {
//  digitalWrite(A1,LOW);
//  digitalWrite(A3,LOW);
  digitalWrite(leftPin,LOW);
  Serial.print(digitalRead(leftPin));
  Serial.print(",");

  delay(50);

  digitalWrite(A3,LOW);
  digitalWrite(A5,LOW);
  digitalWrite(upPin,LOW);
  Serial.print(digitalRead(upPin));
  Serial.print(",");

  delay(50);

  digitalWrite(A8,LOW);
  digitalWrite(A10,LOW);
  digitalWrite(rightPin,LOW);
  Serial.print(digitalRead(rightPin));
  Serial.print(",");

  delay(50);

  digitalWrite(A11,LOW);
  digitalWrite(A13,LOW);  
  digitalWrite(downPin,LOW);
  Serial.print(digitalRead(downPin));
  Serial.print("\n");

  delay(50);
}
