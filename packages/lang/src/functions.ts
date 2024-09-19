export type Consumer<T> = (value: T) => void;
export type Supplier<T> = () => T;
export type Predicate<T> = (value: T) => boolean;
export type Function<T, R> = (value: T) => R;
