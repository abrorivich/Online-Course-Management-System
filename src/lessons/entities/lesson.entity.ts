import { Modules } from "src/modules/entities/module.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", unique: true })
    name: string

    @Column({ type: "varchar" })
    description: string

    @ManyToOne((type) => Modules, (modules) => modules.lesson)
    @JoinColumn()
    modules: Modules
}
