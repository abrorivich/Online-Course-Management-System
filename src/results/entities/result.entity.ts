import { Assignment } from "src/assignments/entities/assignment.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Result {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar" })
    homework: string

    @Column({ type: "varchar", default: "Kutilyapti" })
    teacherMessage: string

    @Column({ type: "int", default: 0 })
    ball: number

    @OneToOne(() => Assignment, assignment => assignment.result)
    @JoinColumn()
    assignment: Assignment;

    @ManyToOne(() => User, user => user.result)
    @JoinColumn()
    user: User;
}
