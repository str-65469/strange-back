export class RandomGenerator {
  public static randomString(length = 40) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ^%&$&^%*$abcdefghijklmnopq^%&$rstuvwxyz01234^%&$56789';
    const charactersLength = characters.length;
    let result = '';

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
