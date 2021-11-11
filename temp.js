let i = 0;
while (i < 10) {
  setTimeout(() => {
    console.log(i);
    i = 100;
  }, 0);
  return;
}
