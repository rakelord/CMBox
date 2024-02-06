using System.Security.Cryptography.X509Certificates;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.WebEncoders.Testing;
using MySql.Data.MySqlClient;

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

    var Query = @"INSERT INTO Navigation (displayname,pagename,parent,icon) VALUES (@displayname,@pagename,@parent,@icon);";
    MySqlCommand myCommand = new MySqlCommand(Query, MySQLConnection);
    myCommand.Parameters.AddWithValue("@displayname", nav.DisplayName);
    myCommand.Parameters.AddWithValue("@pagename", nav.PageName);
    myCommand.Parameters.AddWithValue("@parent", nav.Parent);
    myCommand.Parameters.AddWithValue("@icon", nav.Icon);
    
    myCommand.ExecuteNonQuery();
    MySQLConnection.Close();

    return nav;
}).WithName("PostNavigation").WithOpenApi();

app.MapGet("/test", () => {
    var test = "123".ToArray();
    return test;
}).WithName("GetTest").WithOpenApi();

app.Run();


record Navigation(string DisplayName, string PageName, bool Parent, string Icon){

}
/* record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}*/
