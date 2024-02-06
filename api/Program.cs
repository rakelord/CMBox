using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.WebEncoders.Testing;

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
