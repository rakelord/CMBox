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
builder.Services.AddCors();

var app = builder.Build();
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors(
    options => options.WithOrigins("http://127.0.0.1:3000").AllowAnyMethod()
);

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

    var Query = @"INSERT INTO Navigation (displayname,page_name,nav_parent,parent_id,icon,changed_date,creation_date) VALUES (@displayname,@page_name,@nav_parent,@parent_id,@icon,@changeddate,@creationdate);";
    MySqlCommand command = new(Query, DBConnection);
    command.Parameters.AddWithValue("@displayname", nav.DisplayName);
    command.Parameters.AddWithValue("@page_name", nav.Page_Name);
    command.Parameters.AddWithValue("@nav_parent", nav.Nav_Parent);
    command.Parameters.AddWithValue("@parent_id", nav.Parent_Id);
    command.Parameters.AddWithValue("@icon", nav.Icon);
    command.Parameters.AddWithValue("@changeddate", DateTime.Now);
    command.Parameters.AddWithValue("@creationdate", DateTime.Now);
    
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

    int idIndex = 0;
    int displayNameIndex = 1;
    int pageNameIndex = 2;
    int navParentIndex = 3;
    int parentIdIndex = 4;
    int iconIndex = 5;
    int changedDateIndex = 6;
    int creationDateIndex = 7;

    while (reader.Read())
    {
        Navigation nav = new()
        {
            Id = reader.GetInt32(idIndex),
            DisplayName = reader.GetString(displayNameIndex),
            Page_Name = reader.GetString(pageNameIndex),
            Nav_Parent = reader.GetBoolean(navParentIndex),
            Parent_Id = reader.IsDBNull(parentIdIndex) ? null : reader.GetInt32(parentIdIndex),
            Icon = reader.IsDBNull(iconIndex) ? null : reader.GetString(iconIndex),
            Changed_Date = reader.GetDateTime(changedDateIndex),
            Creation_Date = reader.GetDateTime(creationDateIndex)
        };

        navlist.Add(nav);
    }
    DBConnection.Close();

    return navlist;
}).WithName("GetNavigationList").WithOpenApi();

app.Run();
