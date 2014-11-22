using Demo.Data;
using Demo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Demo.Controllers
{
    public class TasksController : ApiController
    {
        [HttpGet, Route("api/Tasks/All")]
        public IHttpActionResult GetTasks()
        {
            var context = new TasksContext();
            var tasks = context.Tasks
                .OrderBy(t => t.TimeDue);
            return this.Json(tasks);
        }

        [HttpGet, Route("api/Tasks/InProgress")]
        public IHttpActionResult GetInProgress()
        {
            var context = new TasksContext();
            var tasks = context.Tasks
                .Where(t => !t.IsCompleted)
                .OrderBy(t => t.TimeDue);
            return this.Json(tasks);
        }

        public IHttpActionResult GetTask(int id)
        {
            var context = new TasksContext();
            var task = context.Tasks.Find(id);
            if (task == null)
            {
                return StatusCode(HttpStatusCode.NoContent);
            }
            else
            {
                return this.Json(task);
            }
        }

        public IHttpActionResult PutTask(int id, [FromBody]TaskBindingModel task)
        {
            var context = new TasksContext();
            var dbTask = context.Tasks.Find(id);
            if (dbTask != null)
            {
                dbTask.Title = task.Title;
                dbTask.Body = task.Body;

                context.SaveChanges();
                return Json(dbTask);
            }
            else
            {
                return NotFound();
            }
        }

        public IHttpActionResult PostTask([FromBody]TaskBindingModel taskModel)
        {
            var context = new TasksContext();
            var task = new _Task() 
            {
                Title = taskModel.Title,
                Body = taskModel.Body,
                TimeDue = DateTime.Now.AddDays(1),
                IsCompleted = false
            };
            context.Tasks.Add(task);
            context.SaveChanges();
            return Json(task);
        }

        public IHttpActionResult DeleteTask(int id)
        {
            var context = new TasksContext();
            var dbTask = context.Tasks.Find(id);
            if (dbTask != null)
            {
                context.Tasks.Remove(dbTask);
                context.SaveChanges();
                return StatusCode(HttpStatusCode.NoContent);
            }
            else
            {
                return NotFound();
            }
        }
    }
}
