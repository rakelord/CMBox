using System.Security.Cryptography.X509Certificates;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.WebEncoders.Testing;
using MySql.Data.MySqlClient;
using Models;
using Mysqlx.Expr;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.MapPost("/navigation", (Navigation nav) => {

    // Connect to Database
    MySqlConnection MySQLConnection;
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    MySQLConnection = new MySqlConnection(connectionString);
    MySQLConnection.Open();

    var Query = @"INSERT INTO Navigation (displayname,page_name,nav_parent,parent_id,icon) VALUES (@displayname,@page_name,@nav_parent,@parent_id,@icon);";
    MySqlCommand myCommand = new(Query, MySQLConnection);
    myCommand.Parameters.AddWithValue("@displayname", nav.DisplayName);
    myCommand.Parameters.AddWithValue("@page_name", nav.Page_Name);
    myCommand.Parameters.AddWithValue("@nav_parent", nav.Nav_Parent);
    myCommand.Parameters.AddWithValue("@parent_id", nav.Parent_Id);
    myCommand.Parameters.AddWithValue("@icon", nav.Icon);
    
    myCommand.ExecuteNonQuery();
    MySQLConnection.Close();

    return nav;
}).WithName("NewNavigation").WithOpenApi();


app.MapGet("/navigation", () => {
    // Connect to Database
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    MySqlConnection MySQLConnection = new(connectionString);
    MySQLConnection.Open();

    var Query = @"SELECT * FROM Navigation;";
    MySqlCommand myCommand = new(Query, MySQLConnection);
    
    using (var reader = myCommand.ExecuteReader())
    {
        while (reader.Read())
        {
            Console.WriteLine(String.Format("{0}", reader[0]));
        }
    }
    MySQLConnection.Close();
}).WithName("GetNavigationList").WithOpenApi();

app.Run();

/* record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}*/
