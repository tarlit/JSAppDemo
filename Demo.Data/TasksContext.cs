using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;

namespace Demo.Data
{
    public class TasksContext : IdentityDbContext
    {
        public IDbSet<Demo.Models._Task> Tasks { get; set; }
    }
}
