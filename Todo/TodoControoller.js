const {socketIo} = require("socket.io");
const todoModel = require("../Todo/todoModel");
const {getSocketIo} = require("../utils/socketIo");
const Status = {
    Completed : "completed",
    Pending : "pending"
}
class Todo{
     io = getSocketIo(); 
    constructor(){
        this.io.on("connection",(socket)=>{
            console.log("new client connected !!")
            socket.on("addTodo",(data)=>this.handleAddTodo(socket,data))
            socket.on("deleteTodo",(data)=>this.handleDeleteTodo(socket,data))
            socket.on("updateTodoStatus",(data)=>this.handleUpdateTodoStatus(socket,data))
            socket.on("fetchTodos",()=>this.getPendingTodos(socket))
        })
    }
     async handleAddTodo(socket,data){
        try {
        const {task,deadLine,status} = data
        await todoModel.create({
            task, 
            deadLine, 
            status
        })
        const todos = await todoModel.find({status :Status.Pending})
        socket.emit("todos_updated",{
            status : "success", 
            data : todos
        })
        
        } catch (error) {
            socket.emit("todo_response",{
                status : "error", 
                error
            })
        }
    }
     async handleDeleteTodo(socket,data){
       try {
        const {id} = data 
        const deletedTodo = await todoModel.findByIdAndDelete(id)
        if(!deletedTodo){
            socket.emit("todo_response",{
                status : "error", 
                message : "Todo not found"
            })
            return;
        }
        const todos = await todoModel.find({status:Status.Pending})
        socket.emit("todos_updated",{
            status : "success", 
            data : todos
        })
       } catch (error) {
        socket.emit("todo_response",{
            status : "error", 
            error
        })
       }

    }
    async handleUpdateTodoStatus(socket,data){
        try {
        const {id,status} = data 
        const todo = await todoModel.findByIdAndUpdate(id,{status})
        if(!todo){
            socket.emit("todo_response",{
                status : "error", 
                message : "Todo not found"
            })
            return 
        }
        const todos = await todoModel.find({status : Status.Pending})
        socket.emit("todos_updated",{
            status : "success", 
            data : todos
        })
        } catch (error) {
            socket.emit("todo_response",{
                status : "error", 
                error
            })
        }

    }

    async getPendingTodos(socket){
        try {
        const todos = await todoModel.find({status : Status.Pending})
        socket.emit("todos_updated",{
            status : "success", 
            data : todos
        })
        } catch (error) {
            socket.emit("todo_response",{
                status : "error", 
                error
            })
        }
    }
}

export default new Todo()