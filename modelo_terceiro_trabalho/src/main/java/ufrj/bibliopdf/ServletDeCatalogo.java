package ufrj.bibliopdf;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringReader;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import ufrj.bibliopdf.dao.BiblioPDFDAO;
import ufrj.bibliopdf.dto.RespostaCompletaDTO;

public class ServletDeCatalogo extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Não é um conjunto de pares nome-valor,
        // então tem que ler como se fosse um upload de arquivo...
        BufferedReader br = new BufferedReader(
                new InputStreamReader(
                        request.getInputStream(),"UTF8"));
        String json = br.readLine();
        br.close();
//System.out.println("[controller] jsonDoPedido: "+json);

        //Converter o string em "objeto json" java
        // Criar um JsonReader.
        JsonReader reader = Json.createReader(new StringReader(json));
        // Ler e fazer o parsing do String para o "objeto json" java
        JsonObject jsonDoPedido = reader.readObject();
        // Acabou, então fechar o reader.
        reader.close();
//System.out.println("[controller] jsonDoPedido: "+jsonDoPedido.toString());        
        //======================================================================
try{Thread.sleep(2000);}catch(Exception e){}
        RespostaCompletaDTO respostaCompleta = new RespostaCompletaDTO();
        String operacao = jsonDoPedido.getString("operacao");
        String tipoBusca = jsonDoPedido.getString("tipoBusca");
//System.out.println("========= operacao: "+operacao+"    tipoBusca: "+tipoBusca);
        switch(operacao){
            case "salvar_novo":{
                respostaCompleta = new BiblioPDFDAO().salvarNovo(jsonDoPedido);
                break;
            }
            case "salvar_modif":{
                respostaCompleta = new BiblioPDFDAO().salvarModif(jsonDoPedido);
                break;
            }
            case "buscar":{
                if(tipoBusca.equals("patrimonio")){
                    //respostaCompleta = new BiblioPDFDAO().buscarPorPatrimonio(jsonDoPedido);
                }else if(tipoBusca.equals("all")){
                    respostaCompleta = 
                        new BiblioPDFDAO().buscarTodos();
                }else if(tipoBusca.equals("composta")){
                    //respostaCompleta = new BiblioPDFDAO().buscarListaPorPalavraDoTitulo(jsonDoPedido);
                }
                break;
            }
            case "buscar_patrimonio":{
                //respostaCompleta =  new BiblioPDFDAO().buscarPorPatrimonio(jsonDoPedido);
                break;
            }
            case "excluir":{
                respostaCompleta = new BiblioPDFDAO().excluir(jsonDoPedido);
                break;
            }
            default:{};
        }
System.out.println("\n[controller] RespostaCompletaDTO - "+operacao+":\n"+respostaCompleta.toString()+"\n");                
        
        //======================================================================
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();
        out.print(respostaCompleta.toString());
        out.flush();
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
