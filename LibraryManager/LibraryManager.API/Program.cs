using LibraryManager.Core.Application.Interfaces.Repositories;
using LibraryManager.Core.Application.Interfaces.Services;
using LibraryManager.Core.Application.Services;
using LibraryManager.Infrastructure.Data;
using LibraryManager.Infrastructure.Data.Repositories;
using LibraryManager.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Đăng ký các Repository
var dataFolder = Path.Combine(Directory.GetCurrentDirectory(), "Data");

// Đảm bảo thư mục Data tồn tại
if (!Directory.Exists(dataFolder))
{
    Directory.CreateDirectory(dataFolder);
}

// File repositories
builder.Services.AddScoped<IBookRepository>(provider =>
    new FileBookRepository(Path.Combine(dataFolder, "books.json")));

builder.Services.AddScoped<IReaderRepository>(provider =>
    new FileReaderRepository(Path.Combine(dataFolder, "readers.json")));

// Loan repository cần phụ thuộc vào Book và Reader repositories
builder.Services.AddScoped<ILoanRepository>(provider =>
    new FileLoanRepository(
        Path.Combine(dataFolder, "loans.json"),
        provider.GetRequiredService<IBookRepository>(),
        provider.GetRequiredService<IReaderRepository>()
    ));


//builder.Services.AddDbContext<LibraryDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//builder.Services.AddScoped<IBookRepository, BookRepository>();
//builder.Services.AddScoped<IReaderRepository, ReaderRepository>();
//builder.Services.AddScoped<ILoanRepository, LoanRepository>();

builder.Services.AddScoped<BookService>();
builder.Services.AddScoped<ReaderService>();
builder.Services.AddScoped<LoanService>();

builder.Services.AddScoped<INotificationService>(provider =>
{
    var smtpServer = builder.Configuration["EmailSettings:SmtpServer"]
                     ?? throw new ArgumentNullException("EmailSettings:SmtpServer", "SMTP Server configuration is missing.");
    var smtpPortString = builder.Configuration["EmailSettings:SmtpPort"]
                         ?? throw new ArgumentNullException("EmailSettings:SmtpPort", "SMTP Port configuration is missing.");
    if (!int.TryParse(smtpPortString, out var smtpPort))
    {
        throw new FormatException("SMTP Port configuration is not a valid integer.");
    }
    var smtpUsername = builder.Configuration["EmailSettings:Username"]
                       ?? throw new ArgumentNullException("EmailSettings:Username", "SMTP Username configuration is missing.");
    var smtpPassword = builder.Configuration["EmailSettings:Password"]
                       ?? throw new ArgumentNullException("EmailSettings:Password", "SMTP Password configuration is missing.");
    var senderEmail = builder.Configuration["EmailSettings:SenderEmail"]
                      ?? throw new ArgumentNullException("EmailSettings:SenderEmail", "Sender Email configuration is missing.");
    return new EmailNotificationService(
        provider.GetRequiredService<ILogger<EmailNotificationService>>(),
        smtpServer,
        smtpPort,
        smtpUsername,
        smtpPassword,
        senderEmail
    );
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



app.UseCors("AllowFrontend");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();