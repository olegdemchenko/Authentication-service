import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 30,
    unique: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  password: string;

  @Column({
    type: "varchar",
    nullable: true,
  })
  googleId: string;

  @Column({
    type: "varchar",
    nullable: true,
  })
  facebookId: string;

  @Column({
    type: "boolean",
    default: false,
  })
  isVerified: boolean;

  @Column({
    type: "varchar",
    nullable: true,
  })
  email: string;
}

export default User;
