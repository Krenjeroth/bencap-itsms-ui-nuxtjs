declare global {
  interface IModalTitle {
    title: string;
  }

  interface IModalClose {
    (): void;
  }
}

export { IModalTitle, IModalClose };
