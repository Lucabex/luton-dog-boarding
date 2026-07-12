namespace DogWalkerApi.Services;

public interface ISupabaseStorageService
{
    Task<string> UploadAsync(IFormFile file, string folder);
    Task DeleteAsync(string photoUrl);
}

public class SupabaseStorageService : ISupabaseStorageService
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;
    private readonly string _bucket;

    public SupabaseStorageService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _baseUrl = config["Supabase:Url"]!;
        _bucket = config["Supabase:Bucket"]!;
        _httpClient.DefaultRequestHeaders.Add("apikey", config["Supabase:SecretKey"]);
    }

    public async Task<string> UploadAsync(IFormFile file, string folder)
    {
        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var objectPath = $"{folder}/{fileName}";

        using var content = new StreamContent(file.OpenReadStream());
        content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(
            file.ContentType ?? "application/octet-stream");

        var response = await _httpClient.PostAsync(
            $"{_baseUrl}/storage/v1/object/{_bucket}/{objectPath}", content);

        response.EnsureSuccessStatusCode();

        return $"{_baseUrl}/storage/v1/object/public/{_bucket}/{objectPath}";
    }

    public async Task DeleteAsync(string photoUrl)
    {
        var marker = $"/object/public/{_bucket}/";
        var idx = photoUrl.IndexOf(marker, StringComparison.Ordinal);
        if (idx < 0) return;

        var objectPath = photoUrl[(idx + marker.Length)..];
        await _httpClient.DeleteAsync($"{_baseUrl}/storage/v1/object/{_bucket}/{objectPath}");
    }
}