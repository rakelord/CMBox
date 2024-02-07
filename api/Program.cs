using System.Security.Cryptography.X509Certificates;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.WebEncoders.Testing;
using MySql.Data.MySqlClient;
using Models;
using Mysqlx.Expr;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json.Serialization;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

/* 
######################
## POST NAVIGATIONS ##
######################
*/
app.MapPost("/navigation", (Navigation nav) => {

    // Connect to Database
    MySqlConnection DBConnection = new(connectionString);
    DBConnection.Open();

    var Query = @"INSERT INTO Navigation (displayname,page_name,nav_parent,parent_id,icon) VALUES (@displayname,@page_name,@nav_parent,@parent_id,@icon);";
    MySqlCommand command = new(Query, DBConnection);
    command.Parameters.AddWithValue("@displayname", nav.DisplayName);
    command.Parameters.AddWithValue("@page_name", nav.Page_Name);
    command.Parameters.AddWithValue("@nav_parent", nav.Nav_Parent);
    command.Parameters.AddWithValue("@parent_id", nav.Parent_Id);
    command.Parameters.AddWithValue("@icon", nav.Icon);
    
    command.ExecuteNonQuery();
    DBConnection.Close();

    return nav;
}).WithName("NewNavigation").WithOpenApi();

/* 
#####################
## GET NAVIGATIONS ##
#####################
*/
app.MapGet("/navigation", () => {
    // Connect to Database
    MySqlConnection DBConnection = new(connectionString);
    DBConnection.Open();

    var Query = @"SELECT * FROM Navigation;";
    MySqlCommand command = new(Query, DBConnection);

    using MySqlDataReader reader = command.ExecuteReader();
    var navlist = new List<Navigation>();
    while (reader.Read())
    {
        Navigation nav = new()
        {
            Id = (int)reader[0],
            DisplayName = (string)reader[1],
            Page_Name = (string)reader[2],
            Nav_Parent = (bool)reader[3],
            Parent_Id = (reader[4] == DBNull.Value) ? null : (int)reader[4],
            Icon = (reader[5] == DBNull.Value) ? null : (string)reader[5]
        };

        navlist.Add(nav);
    }
    DBConnection.Close();

    return navlist;
}).WithName("GetNavigationList").WithOpenApi();

app.Run();
