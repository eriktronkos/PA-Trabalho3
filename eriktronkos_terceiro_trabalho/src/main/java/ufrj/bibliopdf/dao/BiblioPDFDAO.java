package ufrj.bibliopdf.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Set;
import javax.json.JsonObject;
import ufrj.bibliopdf.dto.RespostaCompletaDTO;
import ufrj.bibliopdf.dto.RespostaDTO;
import utils.Utils;

public class BiblioPDFDAO extends BaseDAO {

//------------------------------------------------------------------------------
    public boolean contains(Object[] keys, String key){
        boolean yes = false;
        for(Object temp : keys){
            if(((String)temp).equals(key)) yes = true;
        }
        return yes;
    }
//------------------------------------------------------------------------------
    
    public RespostaCompletaDTO buscarListaPorPalavraDoTituloWS(String titulo, String autoria, String veiculo){
        RespostaCompletaDTO listaRefsDTO = new RespostaCompletaDTO();
        RespostaDTO umaRefDTO = null;

        String preparedStatement = prepararComandoSQL3(titulo, autoria, veiculo);

        try(Connection conexao = getConnection()){
            
            PreparedStatement comandoSQL = conexao.prepareStatement(preparedStatement);

            int deslocamento = 0;
            
            if(!titulo.isEmpty()){
                String[] palavrasDoTitulo = extrairPalavrasDaBusca(titulo);
                for(int i=0;i<palavrasDoTitulo.length;i++){
                    comandoSQL.setString(i+1, palavrasDoTitulo[i]);
                }
                deslocamento = palavrasDoTitulo.length;
            }

            if(!autoria.isEmpty()){
                String[] palavrasDaAutoria = extrairPalavrasDaBusca(autoria);
                for(int i=0;i<palavrasDaAutoria.length;i++){
                    comandoSQL.setString(i+1+deslocamento, palavrasDaAutoria[i]);
                }
                deslocamento += palavrasDaAutoria.length;
            }
            
            if(!veiculo.isEmpty()){
                String[] palavrasDoVeiculo = extrairPalavrasDaBusca(veiculo);
                for(int i=0;i<palavrasDoVeiculo.length;i++){
                    comandoSQL.setString(i+1+deslocamento, palavrasDoVeiculo[i]);
                }
                deslocamento += palavrasDoVeiculo.length;
            }
            
//System.out.println("-----------------------\n"+comandoSQL+"\n");

            ResultSet rs = comandoSQL.executeQuery();
            while(rs.next()){
                umaRefDTO = new RespostaDTO();
                umaRefDTO.setPatrimonio(Long.toString(rs.getLong("patrimonio")));
                umaRefDTO.setTitulo(rs.getString("titulo"));
                umaRefDTO.setAutoria(rs.getString("autoria"));
                umaRefDTO.setVeiculo(rs.getString("veiculo"));
                String str ="zzz";
                //java.sql.Timestamp t = rs.getTimestamp("data_publicacao");
                java.sql.Date t = rs.getDate("data_publicacao");
                if(t!=null){
                    str = t.toString();
                }
                umaRefDTO.setNrohits(Integer.toString(rs.getInt("nrohits")));

                umaRefDTO.setData_publicacao(str);
                listaRefsDTO.addResposta(umaRefDTO);
            }
        }catch(Exception e){
            e.printStackTrace();
        }
        
        return listaRefsDTO;
    }
//------------------------------------------------------------------------------    
    private String prepararComandoSQL(String[] palavrasDaBusca){
        String inicioSelectExterno = 
        "SELECT T1.patrimonio, T1.titulo, T1.autoria, T1.veiculo, T1.data_publicacao, (count(*)) AS nrohits \n" +
        "FROM dadoscatalogo T1 \n" +
        "INNER JOIN palavrastitulonormal T2 ON(T1.patrimonio = T2.patrimonio) WHERE \n";
        
        String finalSelectExterno = 
        "GROUP BY T1.patrimonio, T1.titulo, T1.autoria, T1.veiculo, T1.data_publicacao ORDER BY nrohits DESC, titulo ASC;";
        
        String baseComando = "T2.palavra_titulo_normal LIKE ? \n";
        
        String comando = "";
        for(int i=0;i<palavrasDaBusca.length;i++){
            comando = comando + baseComando;
            if(i<(palavrasDaBusca.length-1)){
                comando = comando + "OR \n";
            }
        }
        comando = inicioSelectExterno + comando + finalSelectExterno;
        return comando;
    }    
//------------------------------------------------------------------------------    
    private String prepararComandoSQL3(String titulo, String autoria, String veiculo){
       
        String inicioComando = 
        "select T5.patrimonio, T5.titulo, T5.autoria, T5.veiculo,"+
        " T5.data_publicacao,"+
        " sum(dm) as nrohits \nfrom (";

        String inicioOpcaoTitulo =     
        "(select T1.patrimonio, T1.titulo, T1.autoria, T1.veiculo, T1.data_publicacao, \n"+
        "(count(*)) AS dm from dadoscatalogo T1 \n"+
        "inner join palavrastitulonormal T2 on (T1.patrimonio=T2.patrimonio) where \n";
        
        String parametroTitulo = 
        "T2.palavra_titulo_normal like ? \n";
        
        String or = "OR \n";        
        
        String fimOpcaoTitulo = 
        "group by T1.patrimonio, T1.titulo, T1.autoria, T1.veiculo, T1.data_publicacao) \n";

        String union = "union all\n";
        
        String inicioOpcaoAutoria = 
        "(select T1.patrimonio, T1.titulo, T1.autoria, T1.veiculo, T1.data_publicacao, \n"+
        "(count(*)) AS dm from dadoscatalogo T1 \n"+
        "inner join palavrasautorianormal T3 on (T1.patrimonio=T3.patrimonio) where \n";
        
        String parametroAutoria = 
        "T3.palavra_autoria_normal like ? \n";
        
        String fimOpcaoAutoria = 
        "group by T1.patrimonio, T1.titulo, T1.autoria, T1.veiculo, T1.data_publicacao) \n";

        String inicioOpcaoVeiculo = 
        "(select T1.patrimonio, T1.titulo, T1.autoria, T1.veiculo, T1.data_publicacao, \n"+
        "(count(*)) AS dm from dadoscatalogo T1 \n"+
        "inner join palavrasveiculonormal T4 on (T1.patrimonio=T4.patrimonio) where \n";
        
        String parametroVeiculo = 
        "T4.palavra_veiculo_normal like ? \n";
        
        String fimOpcaoVeiculo = 
        "group by T1.patrimonio, T1.titulo, T1.autoria, T1.veiculo, T1.data_publicacao) \n";

        String fimComando =     
        ") as T5 group by 1,2,3,4,5 ORDER BY nrohits DESC;";
        // --group by T5.coluna1, T5.coluna2, T5.colunadata;


        //===== INICIO
        String comando = inicioComando;
        if(!titulo.isEmpty()){
            String[] palavrasDoTitulo = extrairPalavrasDaBusca(titulo);
            comando = comando + inicioOpcaoTitulo;
            for(int i=0;i<palavrasDoTitulo.length;i++){
                comando = comando + parametroTitulo;
                if(i<(palavrasDoTitulo.length-1)){
                    comando = comando + "OR \n";
                }
            }
            comando = comando + fimOpcaoTitulo;
        }
        
        if(!(titulo.isEmpty())&& (!autoria.isEmpty() || !veiculo.isEmpty())){
            comando = comando + union;
        }
        
        if(!autoria.isEmpty()){
            String[] palavrasDaAutoria = extrairPalavrasDaBusca(autoria);
            comando = comando + inicioOpcaoAutoria;
            for(int i=0;i<palavrasDaAutoria.length;i++){
                comando = comando + parametroAutoria;
                if(i<(palavrasDaAutoria.length-1)){
                    comando = comando + "OR \n";
                }
            }
            comando = comando + fimOpcaoAutoria;
        }
        
//        if((contains(keys,"titulo")||contains(keys,"autoria"))&&
        if(!autoria.isEmpty() && !veiculo.isEmpty()){
            comando = comando + union;
        }
        
        if(!veiculo.isEmpty()){
            String[] palavrasDoVeiculo = extrairPalavrasDaBusca(veiculo);
            comando = comando + inicioOpcaoVeiculo;
            for(int i=0;i<palavrasDoVeiculo.length;i++){
                comando = comando + parametroVeiculo;
                if(i<(palavrasDoVeiculo.length-1)){
                    comando = comando + "OR \n";
                }
            }
            comando = comando + fimOpcaoVeiculo;
        }
        
        comando = comando + fimComando; 
        return comando;
    }    
//------------------------------------------------------------------------------    
    private String[] extrairPalavrasDaBusca(String dados){
        String busca = dados;
        busca = Utils.removerDiacriticosNormalizar(busca);
        String[] temp = busca.split(" ");
        for(int i=0;i<temp.length;i++){
            temp[i] = temp[i].trim();
        }
        return temp;    
    }
//------------------------------------------------------------------------------    
    private String[] extrairPalavrasDaCatalogacao(JsonObject dados,String campo){
        String termo = dados.getString(campo);
        String busca = Utils.removerDiacriticosNormalizar(termo);
        String[] temp = busca.split(" ");
        for(int i=0;i<temp.length;i++){
            temp[i] = temp[i].trim();
        }
        return temp;    
    }
//------------------------------------------------------------------------------ 
    public RespostaCompletaDTO buscarTodos() {
        RespostaCompletaDTO listaRefsDTO = new RespostaCompletaDTO();
        RespostaDTO umaRefDTO = new RespostaDTO();
        Connection conexao = null;
        try {
            conexao = getConnection();
            PreparedStatement comandoSQL = conexao.prepareStatement(
                    "SELECT * FROM dadoscatalogo ORDER BY patrimonio;");

            ResultSet rs = comandoSQL.executeQuery();
            while(rs.next()){
                umaRefDTO = new RespostaDTO();
                umaRefDTO.setPatrimonio(Long.toString(rs.getLong("patrimonio")));
                umaRefDTO.setTitulo(rs.getString("titulo"));
                umaRefDTO.setAutoria(rs.getString("autoria"));
                umaRefDTO.setVeiculo(rs.getString("veiculo"));
                String str ="zzz";
                //java.sql.Timestamp t = rs.getTimestamp("data_publicacao");
                java.sql.Date t = rs.getDate("data_publicacao");
                if(t!=null){
                    str = t.toString();
                }
                umaRefDTO.setData_publicacao(str);
                umaRefDTO.setNrohits("1");
                listaRefsDTO.addResposta(umaRefDTO);
            }
        } catch (Exception e) {
            umaRefDTO.setPatrimonio("0");
            umaRefDTO.setTitulo("ERRO");
            e.printStackTrace();
        }

        try {
            if (conexao != null) {
                conexao.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return listaRefsDTO;
    }
//------------------------------------------------------------------------------     
    public RespostaCompletaDTO buscarPorPatrimonioWS(Long dados) {
        RespostaCompletaDTO listaRefsDTO = new RespostaCompletaDTO();
        RespostaDTO umaRefDTO = new RespostaDTO();
        Connection conexao = null;
        try {
            conexao = getConnection();
            PreparedStatement comandoSQL = conexao.prepareStatement(
                    "SELECT * FROM dadoscatalogo WHERE patrimonio=?;");

            comandoSQL.setLong(1, dados);

            ResultSet rs = comandoSQL.executeQuery();
            if (rs.next()) {
                umaRefDTO.setPatrimonio(Long.toString(rs.getLong("patrimonio")));
                umaRefDTO.setTitulo(rs.getString("titulo"));
                umaRefDTO.setAutoria(rs.getString("autoria"));
                umaRefDTO.setVeiculo(rs.getString("veiculo"));
                String str ="zzz";
                //java.sql.Timestamp t = rs.getTimestamp("data_publicacao");
                java.sql.Date t = rs.getDate("data_publicacao");
                if(t!=null){
                    str = t.toString();
                }
                umaRefDTO.setData_publicacao(str);
                umaRefDTO.setNrohits("1");
            } else {
                umaRefDTO.setPatrimonio("0");
                umaRefDTO.setTitulo("ERRO");
            }
        } catch (Exception e) {
            umaRefDTO.setPatrimonio("0");
            umaRefDTO.setTitulo("ERRO");
            e.printStackTrace();
        }

        try {
            if (conexao != null) {
                conexao.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        listaRefsDTO.addResposta(umaRefDTO);
        return listaRefsDTO;
    }
//------------------------------------------------------------------------------
    public RespostaCompletaDTO salvarNovo(JsonObject dados) {
        RespostaCompletaDTO listaRefsDTO = new RespostaCompletaDTO();
        RespostaDTO umaRefDTO = new RespostaDTO();
        ResultSet rst = null;
        long patrimonio = 0L;
        
        String titulo = dados.getString("titulo").trim();
        titulo = titulo.replaceAll("\\s+", " ");
        String autoria = dados.getString("autoria").trim();
        autoria = autoria.replaceAll("\\s+", " ");
        String veiculo = dados.getString("veiculo").trim();
        veiculo = veiculo.replaceAll("\\s+", " ");
        String data_publicacao = dados.getString("data_publicacao").trim();
        data_publicacao = data_publicacao.replaceAll("\\s+", " ");
        
//        String palchave = dados.getString("palchave").trim();
//        palchave = palchave.replaceAll("\\s+", " ");
        
        // Ainda não está bom. Não gera excessão
        long timestamp = 0; 
        Date result2 = new Date();
        try{        
            DateFormat df2 = new SimpleDateFormat("yyyy-MM-dd");
            String string2 = data_publicacao; //"2001-07-04";
            result2 = df2.parse(string2);  
            timestamp = result2.getTime();
        }catch(Exception e){
            e.printStackTrace();
        }
        String str ="zzz";
        java.sql.Date t = new java.sql.Date(timestamp);
        if(t!=null){
            str = t.toString();
        }
        
        try (Connection conexao = getConnection()) {
            // BEGIN TRANSACTION
            conexao.setAutoCommit(false);
            
            // PRIMEIRA TABELA
            PreparedStatement comandoSQL = conexao.prepareStatement(
            "INSERT INTO dadoscatalogo (titulo,autoria,veiculo,data_publicacao) "+
            "VALUES(?,?,?,?) RETURNING patrimonio;");
            comandoSQL.setString(1, titulo);
            comandoSQL.setString(2, autoria);
            comandoSQL.setString(3, veiculo);
            comandoSQL.setTimestamp(4,new java.sql.Timestamp(timestamp));
            rst = comandoSQL.executeQuery();
            rst.next();
            patrimonio = rst.getLong("patrimonio");
            
            // SEGUNDA TABELA
            String[] palavrasDaBusca = extrairPalavrasDaCatalogacao(dados,"titulo");
            for (String cadaPalavra : palavrasDaBusca) {
                comandoSQL = conexao.prepareStatement(
            "INSERT INTO palavrastitulonormal (palavra_titulo_normal,patrimonio) "+
            "VALUES(?,?);");
                comandoSQL.setString(1, cadaPalavra);
                comandoSQL.setLong(2, patrimonio);
                comandoSQL.executeUpdate();
            }
            
            // TERCEIRA TABELA
            palavrasDaBusca = extrairPalavrasDaCatalogacao(dados,"autoria");
            for (String cadaPalavra : palavrasDaBusca) {
                comandoSQL = conexao.prepareStatement(
            "INSERT INTO palavrasautorianormal (palavra_autoria_normal,patrimonio) "+
            "VALUES(?,?);");
                comandoSQL.setString(1, cadaPalavra);
                comandoSQL.setLong(2, patrimonio);
                comandoSQL.executeUpdate();
            }
            
            // QUARTA TABELA
            palavrasDaBusca = extrairPalavrasDaCatalogacao(dados,"veiculo");
            for (String cadaPalavra : palavrasDaBusca) {
                comandoSQL = conexao.prepareStatement(
            "INSERT INTO palavrasveiculonormal (palavra_veiculo_normal,patrimonio) "+
            "VALUES(?,?);");
                comandoSQL.setString(1, cadaPalavra);
                comandoSQL.setLong(2, patrimonio);
                comandoSQL.executeUpdate();
            }
            
            // COMMIT TRANSACTION
            conexao.commit();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        umaRefDTO.setPatrimonio(Long.toString(patrimonio));
        umaRefDTO.setTitulo(titulo);
        umaRefDTO.setAutoria(autoria);
        umaRefDTO.setVeiculo(veiculo);
        umaRefDTO.setData_publicacao(str);
        listaRefsDTO.addResposta(umaRefDTO);
        listaRefsDTO.setSucesso(true);
        return listaRefsDTO;
    }
//------------------------------------------------------------------------------
    public RespostaCompletaDTO salvarModif(JsonObject dados) {
        RespostaCompletaDTO listaRefsDTO = new RespostaCompletaDTO();
        RespostaDTO umaRefDTO = new RespostaDTO();
        ResultSet rst = null;
        long patrimonio = Long.parseLong(dados.getString("patrimonio"));
        
        String titulo = dados.getString("titulo").trim();
        titulo = titulo.replaceAll("\\s+", " ");
        String autoria = dados.getString("autoria").trim();
        autoria = autoria.replaceAll("\\s+", " ");
        String veiculo = dados.getString("veiculo").trim();
        veiculo = veiculo.replaceAll("\\s+", " ");
        String data_publicacao = dados.getString("data_publicacao").trim();
        data_publicacao = data_publicacao.replaceAll("\\s+", " ");
        String palchave = dados.getString("palchave").trim();
        palchave = palchave.replaceAll("\\s+", " ");
        
        // Ainda não está bom. Não gera excessão
        long timestamp = 0; 
        Date result2 = new Date();
        try{        
            DateFormat df2 = new SimpleDateFormat("yyyy-MM-dd");
            String string2 = data_publicacao; //"2001-07-04";
            result2 = df2.parse(string2);  
            timestamp = result2.getTime();
        }catch(Exception e){
            e.printStackTrace();
        }
        String str ="zzz";
        java.sql.Date t = new java.sql.Date(timestamp);
        if(t!=null){
            str = t.toString();
        }
        
        try (Connection conexao = getConnection()) {
            // BEGIN TRANSACTION
            conexao.setAutoCommit(false);
            
            // PRIMEIRA TABELA
            PreparedStatement comandoSQL = conexao.prepareStatement(
            "UPDATE dadoscatalogo SET titulo=?, autoria=?, veiculo=?, data_publicacao=? "+
            "WHERE patrimonio=?;");
            comandoSQL.setString(1, titulo);
            comandoSQL.setString(2, autoria);
            comandoSQL.setString(3, veiculo);
            comandoSQL.setTimestamp(4,new java.sql.Timestamp(timestamp));
            comandoSQL.setLong(5, patrimonio);
            int count = comandoSQL.executeUpdate();
            if(count!=1){
                listaRefsDTO.setSucesso(false);
                listaRefsDTO.addResposta(umaRefDTO);
                return listaRefsDTO;
            }else{
                comandoSQL = conexao.prepareStatement(
                    "DELETE FROM palavrastitulonormal WHERE patrimonio=?;"
                );
                comandoSQL.setLong(1,patrimonio);
                comandoSQL.executeUpdate();
                
                comandoSQL = conexao.prepareStatement(
                    "DELETE FROM palavrasautorianormal WHERE patrimonio=?;"
                );
                comandoSQL.setLong(1,patrimonio);
                comandoSQL.executeUpdate();
                
                comandoSQL = conexao.prepareStatement(
                    "DELETE FROM palavrasveiculonormal WHERE patrimonio=?;"
                );
                comandoSQL.setLong(1,patrimonio);
                comandoSQL.executeUpdate();
            }
            
            // SEGUNDA TABELA
            String[] palavrasDaBusca = extrairPalavrasDaCatalogacao(dados,"titulo");
            for (String cadaPalavra : palavrasDaBusca) {
                comandoSQL = conexao.prepareStatement(
            "INSERT INTO palavrastitulonormal (palavra_titulo_normal,patrimonio) "+
            "VALUES(?,?);");
                comandoSQL.setString(1, cadaPalavra);
                comandoSQL.setLong(2, patrimonio);
                comandoSQL.executeUpdate();
            }
            
            // TERCEIRA TABELA
            palavrasDaBusca = extrairPalavrasDaCatalogacao(dados,"autoria");
            for (String cadaPalavra : palavrasDaBusca) {
                comandoSQL = conexao.prepareStatement(
            "INSERT INTO palavrasautorianormal (palavra_autoria_normal,patrimonio) "+
            "VALUES(?,?);");
                comandoSQL.setString(1, cadaPalavra);
                comandoSQL.setLong(2, patrimonio);
                comandoSQL.executeUpdate();
            }
            
            // QUARTA TABELA
            palavrasDaBusca = extrairPalavrasDaCatalogacao(dados,"veiculo");
            for (String cadaPalavra : palavrasDaBusca) {
                comandoSQL = conexao.prepareStatement(
            "INSERT INTO palavrasveiculonormal (palavra_veiculo_normal,patrimonio) "+
            "VALUES(?,?);");
                comandoSQL.setString(1, cadaPalavra);
                comandoSQL.setLong(2, patrimonio);
                comandoSQL.executeUpdate();
            }
            
            // COMMIT TRANSACTION
            conexao.commit();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        umaRefDTO.setPatrimonio(Long.toString(patrimonio));
        umaRefDTO.setTitulo(titulo);
        umaRefDTO.setAutoria(autoria);
        umaRefDTO.setVeiculo(veiculo);
        umaRefDTO.setData_publicacao(str);
        listaRefsDTO.addResposta(umaRefDTO);
        listaRefsDTO.setSucesso(true);
        return listaRefsDTO;
    }
//------------------------------------------------------------------------------
    // TESTADO
    public RespostaCompletaDTO excluir(JsonObject dados) {
        RespostaCompletaDTO listaRefsDTO = new RespostaCompletaDTO();
        RespostaDTO umaRefDTO = new RespostaDTO();
        int res = 0;
        try (Connection conexao = getConnection()) {
            PreparedStatement comandoSQL = conexao.prepareStatement(
                    "DELETE FROM dadoscatalogo WHERE patrimonio=?;");
            comandoSQL.setLong(1, Long.parseLong(dados.getString("patrimonio")));
            res = comandoSQL.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
        listaRefsDTO.addResposta(umaRefDTO);
        boolean umExcluido = (res == 1);
        listaRefsDTO.setSucesso(umExcluido);
        return listaRefsDTO;
    }
//------------------------------------------------------------------------------
}
