import { Modules } from "src/modules/entities/module.entity"
import { User } from "src/user/entities/user.entity"
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm"

export enum CourseLevel {
    BEGINNER = 'beginner',
    JUNIOR = 'junior',
    MIDDLE = 'middle',
    SENIOR = 'senior'
}

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", unique: true })
    name: string

    @Column({ type: "varchar" })
    description: string

    @Column({ type: "int" })
    price: number

    @Column({ type: "varchar" })
    teacher: string

    @Column({ type: "varchar" })
    category: string

    @Column({ type: "enum", enum: CourseLevel, default: CourseLevel.BEGINNER })
    level: CourseLevel

    @OneToMany((type) => Modules, (modules) => modules.course, { onDelete: "CASCADE" })
    module: Modules[]

    @ManyToMany(() => User, (user) => user.course, { onDelete: "CASCADE" })
    @JoinTable()
    user: User[];
}
