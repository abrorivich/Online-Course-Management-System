import { Assignment } from "src/assignments/entities/assignment.entity";
import { Modules } from "src/lessons/modules/entities/module.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar"})
    name: string

    @Column({ type: "varchar" })
    description: string

    @ManyToOne((type) => Modules, (modules) => modules.lesson)
    @JoinColumn()
    modules: Modules

    @OneToOne(() => Assignment, assignment => assignment.lesson)
    assignment: Assignment;
}
