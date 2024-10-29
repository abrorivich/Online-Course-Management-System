import { Assignment } from "src/assignments/entities/assignment.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum Status {
    Kutilyapti = 'Kutilyapti',
    Bajarilgan = 'Bajarilgan'
}

@Entity()
export class Result {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar" })
    homework: string

    @Column({ type: "enum" , enum: Status, default: Status.Kutilyapti })
    status: Status

    @Column({ type: "varchar", default: "Kutilyapti" })
    teacherMessage: string

    @Column({ type: "int", default: 0 })
    ball: number

    @OneToOne(() => Assignment, assignment => assignment.result, { onDelete: "CASCADE" })
    @JoinColumn()
    assignment: Assignment;

    @ManyToOne(() => User, user => user.result, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User;
}
