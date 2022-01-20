abstract class Either<L, R> {
    abstract fold<B>(ifLeft: (l: L) => B, ifRight: (r: R) => B): B;

    public isLeft(): boolean {
        return this.fold(
            () => true,
            () => false,
        );
    }

    public isRight(): boolean {
        return this.fold(
            () => false,
            () => true,
        );
    }

    public mapRight<R2>(f: (r: R) => R2): Either<L, R2> {
        return this.fold(
            (l: L) => left(l),
            (r: R) => right(f(r)),
        );
    }

    public mapLeft<L2>(f: (l: L) => L2): Either<L2, R> {
        return this.fold(
            (l: L) => left(f(l)),
            (r) => right(r),
        );
    }
}

class Left<L, R> extends Either<L, R> {
    public constructor(private readonly value: L) {
        super();
    }

    public fold<B>(ifLeft: (l: L) => B, ifRight: (r: R) => B): B {
        return ifLeft(this.value);
    }
}

class Right<L, R> extends Either<L, R> {
    public constructor(private readonly value: R) {
        super();
    }

    public fold<B>(ifLeft: (l: L) => B, ifRight: (r: R) => B): B {
        return ifRight(this.value);
    }
}

const left = <L, R>(value: L): Either<L, R> => new Left<L, R>(value);

const right = <L, R>(value: R): Either<L, R> => new Right<L, R>(value);

export { Left, left, Right, right };
export type { Either };
