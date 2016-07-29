package ufrj.bibliopdf.resources;

/**
 *
 * @author erikeft
 */
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.StringReader;
import java.nio.file.Files;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import ufrj.bibliopdf.dao.BiblioPDFDAO;
import ufrj.bibliopdf.dto.RespostaCompletaDTO;

@Path("catalogo")
public class CatalogoResource {

    @Context
    private UriInfo context;

    public CatalogoResource() {
    }

    @GET
    @Path("/busca")
    @Produces(MediaType.APPLICATION_JSON)
    public String getBusca(
                @DefaultValue("all") @QueryParam("tipoBusca") String tipoBusca,
                @DefaultValue("")    @QueryParam("patrimonio") Long patrimonio,
		@DefaultValue("")    @QueryParam("titulo") String titulo,
                @DefaultValue("")    @QueryParam("autoria") String autoria,
                @DefaultValue("")    @QueryParam("veiculo") String veiculo
    ) {
        
        RespostaCompletaDTO respostaCompleta = new RespostaCompletaDTO();
        if(tipoBusca.equals("patrimonio")){
                    respostaCompleta = 
                        new BiblioPDFDAO().buscarPorPatrimonioWS(patrimonio);
                }else if(tipoBusca.equals("all")){
                    respostaCompleta = 
                        new BiblioPDFDAO().buscarTodos();
                }else if(tipoBusca.equals("composta")){
                    respostaCompleta = 
                        new BiblioPDFDAO().buscarListaPorPalavraDoTituloWS(titulo, autoria, veiculo);
                }
        return respostaCompleta.toString();
    }
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String postCatalogo(String content) {
        
        RespostaCompletaDTO respostaCompleta = new RespostaCompletaDTO();
        
        // Criar um JsonReader.
        JsonReader reader = Json.createReader(new StringReader(content));
        // Ler e fazer o parsing do String para o "objeto json" java
        JsonObject jsonDoPedido = reader.readObject();
        // Acabou, então fechar o reader.
        reader.close();
        
        respostaCompleta = new BiblioPDFDAO().salvarNovo(jsonDoPedido);
        
        
        return respostaCompleta.toString();
    }
    
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String putCatalogo(String content) {
        
        RespostaCompletaDTO respostaCompleta = new RespostaCompletaDTO();
        
        // Criar um JsonReader.
        JsonReader reader = Json.createReader(new StringReader(content));
        // Ler e fazer o parsing do String para o "objeto json" java
        JsonObject jsonDoPedido = reader.readObject();
        // Acabou, então fechar o reader.
        reader.close();
        
        respostaCompleta = new BiblioPDFDAO().salvarModif(jsonDoPedido);
        
        
        return respostaCompleta.toString();
    }
    
    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteCatalogo(String content) {
        
        RespostaCompletaDTO respostaCompleta = new RespostaCompletaDTO();
        
        // Criar um JsonReader.
        JsonReader reader = Json.createReader(new StringReader(content));
        // Ler e fazer o parsing do String para o "objeto json" java
        JsonObject jsonDoPedido = reader.readObject();
        // Acabou, então fechar o reader.
        reader.close();
        
        respostaCompleta = new BiblioPDFDAO().excluir(jsonDoPedido);
        
        return respostaCompleta.toString();
    }
    
@POST
@Path("/pdf")
@Consumes({MediaType.MULTIPART_FORM_DATA})
public Response uploadPdfFile(  @FormDataParam("file") InputStream fileInputStream,
                                @FormDataParam("patrimonio") long patrimonio
) throws Exception
{
    String UPLOAD_PATH = "../temp/";
    try
    {
        int read = 0;
        byte[] bytes = new byte[4096];
 
        OutputStream out = new FileOutputStream(UPLOAD_PATH + patrimonio + ".pdf");
        while ((read = fileInputStream.read(bytes)) != -1) 
        {
            out.write(bytes, 0, read);
        }
        out.flush();
        out.close();
    } catch (IOException e) 
    {
        throw new WebApplicationException("Error while uploading file. Please try again !!");
    }
    return Response.ok("Data uploaded successfully !!").build();
}

@GET
@Path("/pdf/{id}")
@Produces(MediaType.APPLICATION_OCTET_STREAM)
public Response getFile(@PathParam("id") long patrimonio) {
    File file = new File("../temp/"+patrimonio+".pdf");
    Response.ResponseBuilder response = Response.ok((Object) file);
    response.header("Content-Disposition", "attachment; filename="+patrimonio+".pdf");
    return response.build();

}

@GET
@Path("/pdfread/{id}")
@Produces("application/pdf")
public Response getFileRead(@PathParam("id") long patrimonio) {
    File file = new File("../temp/"+patrimonio+".pdf");
    Response.ResponseBuilder response = Response.ok((Object) file);
    response.header("Content-Disposition", "inline; filename="+patrimonio+".pdf");
    return response.build();

}
        
//    @GET
//    @Path("/getjson/{argumento}")
//    @Produces(MediaType.APPLICATION_JSON)
//    public String getJson(@PathParam("argumento") String argumento) {
//        return "{\"valor\":\""+argumento+"\"}";
//    }
//
//    @PUT
//    @Consumes(MediaType.APPLICATION_JSON)
//    public void putJson(String content) {
//        System.out.println("=== "+content);
//    }
//    
//    @POST
//    @Path("/post/{argumento}")
//    @Consumes(MediaType.APPLICATION_JSON)
//    @Produces("text/plain")
//    public String postJson(String content) {
//        System.out.println("=== "+content);
//        return content;
//    }
    
}