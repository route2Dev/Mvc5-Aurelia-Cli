namespace Mvc5_Aurelia_Cli.Migrations
{
    using Entities;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Mvc5_Aurelia_Cli.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            ContextKey = "Mvc5_Aurelia_Cli.Models.ApplicationDbContext";
        }

        protected override void Seed(Mvc5_Aurelia_Cli.Models.ApplicationDbContext context)
        {
            if (context.Clients.Count() > 0)
            {
                return;
            }

            context.Clients.AddRange(BuildClientList());
            context.SaveChanges();
        }

        private static List<Client> BuildClientList()
        {
            var clients = new List<Client>
            {
                new Client
                { Id = "AureliaAuthApp",
                    Secret= Helper.GetHash("abc@812"),
                    Name="Aurelia front-end Application",
                    ApplicationType =  Models.ApplicationTypes.JavaScript,
                    Active = true,
                    RefreshTokenLifeTime = 7200,
                    AllowedOrigin = "*"
                },
            };

            return clients;
        }
    }
}
