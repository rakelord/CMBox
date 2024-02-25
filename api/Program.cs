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

    var Query = @"INSERT INTO Navigation (Display_name,Page_name,Is_parent,Parent_id,icon,Creation_date) VALUES (@displayname,@page_name,@is_parent,@parent_id,@icon,@creationdate);";
    MySqlCommand command = new(Query, DBConnection);
    command.Parameters.AddWithValue("@displayname", nav.Display_name);
    command.Parameters.AddWithValue("@page_name", nav.Page_name);
    command.Parameters.AddWithValue("@is_parent", nav.Is_parent);
    command.Parameters.AddWithValue("@parent_id", nav.Parent_id);
    command.Parameters.AddWithValue("@icon", nav.Icon);
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
app.MapGet("/navigation", (HttpRequest request) => {
    // Connect to Database
    MySqlConnection DBConnection = new(connectionString);
    DBConnection.Open();

    var page_name = request.Query["page_name"];

    var Query = @"SELECT * FROM Navigation";
    if (page_name.Count > 0){
        Query += @" WHERE Page_name = @page_name";
    }

    MySqlCommand command = new(Query, DBConnection);
    command.Parameters.AddWithValue("@page_name", page_name);

    using MySqlDataReader reader = command.ExecuteReader();
    var navlist = new List<Navigation>();

    int idIndex = 0;
    int displayNameIndex = 1;
    int pageNameIndex = 2;
    int IsParentIndex = 3;
    int parentIdIndex = 4;
    int iconIndex = 5;
    int changedDateIndex = 6;
    int creationDateIndex = 7;

    while (reader.Read())
    {
        Navigation nav = new()
        {
            Unique_id = reader.GetInt32(idIndex),
            Display_name = reader.GetString(displayNameIndex),
            Page_name = reader.GetString(pageNameIndex),
            Is_parent = reader.GetBoolean(IsParentIndex),
            Parent_id = reader.IsDBNull(parentIdIndex) ? null : reader.GetInt32(parentIdIndex),
            Icon = reader.IsDBNull(iconIndex) ? null : reader.GetString(iconIndex),
            Changed_date = reader.IsDBNull(changedDateIndex) ? null : reader.GetDateTime(changedDateIndex),
            Creation_date = reader.GetDateTime(creationDateIndex)
        };

        navlist.Add(nav);
    }
    DBConnection.Close();

    return navlist;
}).WithName("GetNavigationList").WithOpenApi();

app.Run();
