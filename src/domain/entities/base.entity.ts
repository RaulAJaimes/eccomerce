export abstract class BaseEntity {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  markAsUpdated(): void {
    this.updatedAt = new Date();
  }

  equals(other: BaseEntity): boolean {
    return this.id === other.id;
  }
}